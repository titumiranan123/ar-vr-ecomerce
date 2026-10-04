"use client";

import { Canvas } from "@react-three/fiber";
import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import Link from "next/link";
import { Suspense, useState } from "react";

const MODEL_PATH = "/models/warm-modern-room.glb";

function RoomModel() {
  const { scene } = useGLTF(MODEL_PATH);
  return <primitive object={scene} />;
}

function PreviewScene({ resetKey }: { resetKey: number }) {
  return <>
    <color attach="background" args={["#eee8df"]} />
    <ambientLight intensity={1.7} />
    <directionalLight position={[5, 8, 6]} intensity={3} color="#fff3dc" castShadow />
    <directionalLight position={[-5, 4, 2]} intensity={0.7} color="#d7e2ff" />
    <Bounds fit clip observe margin={1.2}>
      <Center>
        <RoomModel />
      </Center>
    </Bounds>
    <OrbitControls key={resetKey} makeDefault enablePan minDistance={1.5} maxDistance={18} minPolarAngle={0.25} maxPolarAngle={1.52} target={[0, 0.7, 0]} />
  </>;
}

function Icon({ name }: { name: "arrow" | "reset" | "fullscreen" | "cube" }) {
  const props = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "arrow") return <svg {...props}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>;
  if (name === "reset") return <svg {...props}><path d="M4 9a8 8 0 1 1 1.4 7.5" /><path d="M4 4v5h5" /></svg>;
  if (name === "fullscreen") return <svg {...props}><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" /></svg>;
  return <svg {...props}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></svg>;
}

export function RoomPreview() {
  const [resetKey, setResetKey] = useState(0);
  const [notice, setNotice] = useState("");

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      showNotice("Fullscreen is not available in this browser.");
    }
  };

  return <main className="relative h-dvh min-h-[600px] overflow-hidden bg-[#eee8df] text-[#3b3630]">
    <Canvas camera={{ position: [5.8, 4.2, 6.8], fov: 42 }} shadows dpr={[1, 1.6]}>
      <Suspense fallback={null}>
        <PreviewScene resetKey={resetKey} />
      </Suspense>
    </Canvas>

    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 sm:px-9">
      <Link href="/room-planner" className="pointer-events-auto flex items-center gap-3 rounded-full border border-black/10 bg-white/75 px-4 py-2.5 text-sm font-semibold shadow-sm backdrop-blur-md transition hover:bg-white"><Icon name="arrow" />Back to room studio</Link>
      <div className="flex items-center gap-3"><div className="bg-[#e32634] px-3 py-1 text-[25px] font-black tracking-[-.05em] text-white">NESTT</div><span className="hidden text-xs font-medium uppercase tracking-[.2em] text-black/40 sm:inline">3D preview</span></div>
    </header>

    <section className="pointer-events-none absolute left-5 top-24 z-10 max-w-xs sm:left-9">
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a45c35]">Room model preview</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Warm Modern<br />Room</h1>
      <p className="mt-4 text-sm leading-6 text-black/55">Explore the complete room model from every angle. Drag to orbit and scroll to zoom.</p>
    </section>

    <aside className="absolute bottom-5 right-5 z-10 w-[min(310px,calc(100%-40px))] rounded-2xl border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(80,60,40,.14)] backdrop-blur-xl sm:bottom-8 sm:right-9">
      <div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f2dfca] text-[#a45c35]"><Icon name="cube" /></div><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#a45c35]">Static GLB asset</p><h2 className="mt-1 text-lg font-semibold">Warm Modern Room</h2></div></div>
      <div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => setResetKey((value) => value + 1)} className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-xs font-semibold transition hover:border-[#a45c35]"><Icon name="reset" />Reset view</button><button onClick={() => void enterFullscreen()} className="flex items-center justify-center gap-2 rounded-xl bg-[#3b3630] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#a45c35]"><Icon name="fullscreen" />Fullscreen</button></div>
    </aside>

    <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] text-black/50 shadow-sm backdrop-blur-md">Drag to rotate · Scroll to zoom</div>
    {notice && <div className="absolute left-1/2 top-24 z-20 -translate-x-1/2 rounded-full bg-[#3b3630] px-5 py-2.5 text-xs font-semibold text-white shadow-lg">{notice}</div>}
  </main>;
}

useGLTF.preload(MODEL_PATH);
