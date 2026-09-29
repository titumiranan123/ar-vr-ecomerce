"use client";

import { Canvas } from "@react-three/fiber";
import { createXRStore } from "@react-three/xr";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ShowroomScene } from "./showroom-scene";
import { ShowroomUi } from "./showroom-ui";
import { defaultLayouts, type ShowroomLayout, type ShowroomProduct } from "./showroom-data";
import { canPlaceProduct, findNearestValidPlacement } from "./placement-utils";
import { ShowroomErrorBoundary } from "./showroom-error-boundary";
import { ShowroomLoading } from "./showroom-loading";

const STORAGE_KEY = "vistara-showroom-layout";
const cloneDefaults = () => Object.fromEntries(Object.entries(defaultLayouts).map(([id, layout]) => [
  id, { position: [...layout.position], rotationY: layout.rotationY },
])) as Record<string, ShowroomLayout>;
const loadLayouts = (): Record<string, ShowroomLayout> => {
  const defaults = cloneDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...defaults, ...(JSON.parse(saved) as Record<string, ShowroomLayout>) }
      : defaults;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return defaults;
  }
};

export function VrShowroom() {
  const store = useMemo(() => createXRStore({
    controller: {
      rayPointer: { minDistance: 0.15 },
      grabPointer: true,
      teleportPointer: {
        rayModel: { color: "#6ee7f2", opacity: 0.7, size: 0.018 },
        cursorModel: { color: "#6ee7f2", opacity: 0.85 },
      },
    },
    foveation: 1,
    frameBufferScaling: "mid",
  }), []);
  const [layouts, setLayouts] = useState(loadLayouts);
  const [selected, setSelected] = useState<ShowroomProduct | null>(null);
  const [dragging, setDragging] = useState(false);
  const [vrSupported, setVrSupported] = useState<boolean | null>(null);
  const [status, setStatus] = useState("");
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  }, [layouts]);

  useEffect(() => store.onSessionEnd(() => {
    setIsPresenting(false);
    setDragging(false);
  }), [store]);

  useEffect(() => store.subscribe((state) => {
    setIsPresenting(Boolean(state.session));
  }), [store]);

  useEffect(() => {
    let active = true;
    const check = async () => {
      const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
      if (!xr) { if (active) setVrSupported(false); return; }
      const supported = await xr.isSessionSupported("immersive-vr");
      if (active) setVrSupported(Boolean(supported));
    };
    void check();
    return () => { active = false; };
  }, []);

  const rotateSelected = (amount: number) => {
    if (!selected) return;
    const candidate = {
      ...layouts[selected.id],
      rotationY: layouts[selected.id].rotationY + amount,
    };
    const resolved = findNearestValidPlacement(selected.id, candidate, layouts);
    if (!resolved) {
      setStatus("Not enough free space to rotate this item.");
      window.setTimeout(() => setStatus(""), 2500);
      return;
    }
    setLayouts((current) => ({ ...current, [selected.id]: resolved }));
  };

  const enterVr = async () => {
    if (vrSupported === false) {
      setStatus("This browser or device does not support immersive VR.");
      window.setTimeout(() => setStatus(""), 3500); return;
    }
    try {
      const session = await store.enterVR();
      setIsPresenting(Boolean(session));
    }
    catch {
      setStatus("VR could not start. Connect a headset and use HTTPS.");
      window.setTimeout(() => setStatus(""), 3500);
    }
  };

  const exitVr = async () => {
    try {
      await store.getState().session?.end();
    } finally {
      setIsPresenting(false);
    }
  };

  const moveProduct = (id: string, position: [number, number, number]) => {
    const candidate = { ...layouts[id], position };
    if (!canPlaceProduct(id, candidate, layouts)) return false;
    setLayouts((current) => {
      const latestCandidate = { ...current[id], position };
      return canPlaceProduct(id, latestCandidate, current)
        ? { ...current, [id]: latestCandidate }
        : current;
    });
    return true;
  };

  return <ShowroomErrorBoundary><main className="relative h-dvh w-full overflow-hidden bg-[#08090d]">
    <Canvas shadows={!isPresenting} dpr={[0.85, 1.5]} camera={{ position: [0, 2.2, 6.8], fov: 55, near: 0.1, far: 100 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <Suspense fallback={null}>
        <ShowroomScene store={store} layouts={layouts} selected={selected} dragging={dragging}
          onSelect={setSelected}
          onMove={moveProduct}
          onDragChange={setDragging}
          onRotateLeft={() => rotateSelected(-Math.PI / 12)}
          onRotateRight={() => rotateSelected(Math.PI / 12)}
          onResetSelected={() => {
            if (!selected) return;
            setLayouts((current) => ({ ...current, [selected.id]: cloneDefaults()[selected.id] }));
          }}
          onResetAll={() => { setLayouts(cloneDefaults()); setSelected(null); }}
          onExitVr={exitVr} />
      </Suspense>
    </Canvas>
    <ShowroomLoading />
    <ShowroomUi selected={selected} onClose={() => setSelected(null)} onEnterVr={enterVr}
      onExitVr={exitVr} isPresenting={isPresenting}
      onRotateLeft={() => rotateSelected(-Math.PI / 12)} onRotateRight={() => rotateSelected(Math.PI / 12)}
      onResetSelected={() => {
        if (!selected) return;
        setLayouts((current) => ({ ...current, [selected.id]: cloneDefaults()[selected.id] }));
      }}
      onResetAll={() => { setLayouts(cloneDefaults()); setSelected(null); }}
      vrSupported={vrSupported} status={status} />
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="h-1.5 w-1.5 rounded-full bg-white/50 shadow-[0_0_8px_white]" />
    </div>
  </main></ShowroomErrorBoundary>;
}
