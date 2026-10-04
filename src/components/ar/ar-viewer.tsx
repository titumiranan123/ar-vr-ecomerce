"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/components/products/products-data";
import { CubeIcon } from "@/components/ui/icons";

type ModelViewerElement = HTMLElement & {
  activateAR: () => Promise<void>;
  canActivateAR: boolean;
  src: string;
  scale: string;
  orientation: string;
  cameraOrbit: string;
  resetTurntableRotation: (theta?: number) => void;
};

type ArStatusEvent = Event & {
  detail?: { status?: string };
};
type ModelProgressEvent = Event & {
  detail?: { totalProgress?: number };
};
type Compatibility = {
  kind: "checking" | "ready" | "https" | "desktop" | "ios-browser" | "android-services" | "unsupported";
  title: string;
  detail: string;
};

function detectCompatibility(canActivateAR: boolean): Compatibility {
  if (canActivateAR) {
    return { kind: "ready", title: "AR ready", detail: "This device can open the camera and place the product." };
  }
  if (!window.isSecureContext) {
    return { kind: "https", title: "HTTPS is required", detail: "Open this page from a trusted HTTPS URL. A phone cannot use your computer's localhost URL." };
  }

  const agent = navigator.userAgent;
  const isAndroid = /Android/i.test(agent);
  const isIOS = /iPhone|iPad|iPod/i.test(agent);
  const isMobile = isAndroid || isIOS;
  if (!isMobile) {
    return { kind: "desktop", title: "Desktop preview only", detail: "Open this HTTPS page on an AR-compatible Android phone or iPhone to use the camera." };
  }
  if (isIOS && (!/Safari/i.test(agent) || /CriOS|FxiOS|EdgiOS/i.test(agent))) {
    return { kind: "ios-browser", title: "Open in Safari", detail: "Runtime USDZ generation and Quick Look require Safari on this iPhone or iPad." };
  }
  if (isAndroid) {
    return { kind: "android-services", title: "AR services unavailable", detail: "Use current Chrome and install/update Google Play Services for AR (ARCore)." };
  }
  return { kind: "unsupported", title: "AR unavailable", detail: "This device does not expose WebXR, Scene Viewer, or Quick Look support." };
}

const steps = [
  ["1", "Scan the floor", "Move your phone slowly so AR can understand the room."],
  ["2", "Place the product", "When the placement ring appears, tap the floor."],
  ["3", "Adjust the view", "Drag to move and use two fingers to rotate the furniture."],
];

export function ArViewer({ product }: { product: Product }) {
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [message, setMessage] = useState("Loading the true-scale 3D model…");
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [removed, setRemoved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [compatibility, setCompatibility] = useState<Compatibility>({
    kind: "checking",
    title: "Checking AR support",
    detail: "Loading device capabilities…",
  });

  useEffect(() => {
    void import("@google/model-viewer");
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setLoaded(true);
      setFailed(false);
      const canActivate = Boolean(viewer.canActivateAR);
      setSupported(canActivate);
      const diagnosis = detectCompatibility(canActivate);
      setCompatibility(diagnosis);
      setMessage(
        canActivate
          ? "AR is ready on this device."
          : diagnosis.detail,
      );
    };
    const handleError = () => {
      setLoaded(false);
      setFailed(true);
      setMessage("The 3D model could not be loaded. Please retry.");
    };
    const handleProgress = (event: Event) => {
      const total = (event as ModelProgressEvent).detail?.totalProgress ?? 0;
      setProgress(Math.round(total * 100));
    };
    const handleArStatus = (event: Event) => {
      const status = (event as ArStatusEvent).detail?.status;
      if (status === "session-started") setMessage("Move your phone slowly and scan the floor.");
      if (status === "object-placed") setMessage("Placed at true scale. Walk around to inspect it.");
      if (status === "failed") setMessage("AR could not start. Check camera permission and HTTPS.");
      if (status === "not-presenting") setMessage("AR session ended. You can launch it again.");
    };

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    viewer.addEventListener("progress", handleProgress);
    viewer.addEventListener("ar-status", handleArStatus);
    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
      viewer.removeEventListener("progress", handleProgress);
      viewer.removeEventListener("ar-status", handleArStatus);
    };
  }, []);

  const launchAr = async () => {
    const viewer = viewerRef.current;
    if (!viewer || !loaded) return;
    if (!viewer.canActivateAR) {
      const diagnosis = detectCompatibility(false);
      setCompatibility(diagnosis);
      setMessage(diagnosis.detail);
      return;
    }
    try {
      setMessage("Starting camera and floor detection…");
      await viewer.activateAR();
    } catch {
      setMessage("AR launch was cancelled or camera access was unavailable.");
    }
  };

  const rotate = (amount: number) => {
    const next = (rotation + amount + 360) % 360;
    setRotation(next);
    setMessage(`Rotated to ${next}°. AR keeps the product at true scale.`);
  };

  const resetProduct = () => {
    setRotation(0);
    setRemoved(false);
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.cameraOrbit = "0deg 75deg 105%";
      viewer.resetTurntableRotation(0);
    }
    setMessage("Product rotation and preview have been reset.");
  };

  const toggleRemoved = () => {
    setRemoved((current) => {
      const next = !current;
      setMessage(next ? "Product removed. Restore it before launching AR." : "Product restored at true scale.");
      return next;
    });
  };

  const retryModel = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    setLoaded(false);
    setFailed(false);
    setProgress(0);
    setMessage("Retrying the 3D model…");
    viewer.src = "";
    window.requestAnimationFrame(() => {
      viewer.src = product.model;
    });
  };

  return (
    <main className="min-h-dvh bg-[#0b0d12] text-white">
      <header className="flex h-20 items-center justify-between border-b border-white/10 px-5 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-[.3em]">
          NESTT
          <span className="block text-[6px] tracking-[.22em] text-white/45">AUGMENTED REALITY</span>
        </Link>
        <Link href={`/products/${product.slug}`} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-xl" aria-label="Close AR viewer">
          ×
        </Link>
      </header>

      <div className="grid min-h-[calc(100dvh-80px)] lg:grid-cols-[1fr_390px]">
        <section className="relative min-h-[58dvh] overflow-hidden bg-gradient-to-br from-[#e8e4dc] to-[#bcb6aa] lg:min-h-0">
          <model-viewer
            ref={(node) => { viewerRef.current = node as ModelViewerElement | null; }}
            src={product.model}
            ios-src={product.ar.iosModel}
            poster={product.image}
            alt={`True-scale AR model of ${product.name}`}
            camera-controls
            auto-rotate
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-placement={product.ar.placement}
            ar-scale="fixed"
            scale={removed ? "0 0 0" : product.ar.scale}
            orientation={`0deg ${rotation}deg 0deg`}
            xr-environment
            environment-image="neutral"
            exposure="1"
            shadow-intensity="1.2"
            shadow-softness="0.8"
            interaction-prompt="auto"
            loading="eager"
            reveal="auto"
            style={{ width: "100%", height: "100%", minHeight: "inherit", background: "transparent" }}
          >
            <button slot="ar-button" className="hidden">Open AR</button>
          </model-viewer>

          {!loaded && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[#d8d3ca]/75">
              <div className="text-center text-black">
                <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-black/15 border-t-violet-600" />
                <p className="mt-4 text-xs font-bold uppercase tracking-[.2em]">Loading model · {progress}%</p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-black/65 px-4 py-2 text-xs font-semibold backdrop-blur">
            True scale · {product.ar.dimensions}
          </div>
          <div className="absolute right-5 top-5 grid grid-cols-2 gap-2 sm:flex">
            <button onClick={() => rotate(-15)} className="rounded-full bg-black/65 px-4 py-2 text-xs font-bold backdrop-blur">↶ Rotate</button>
            <button onClick={() => rotate(15)} className="rounded-full bg-black/65 px-4 py-2 text-xs font-bold backdrop-blur">Rotate ↷</button>
            <button onClick={resetProduct} className="rounded-full bg-black/65 px-4 py-2 text-xs font-bold backdrop-blur">Reset</button>
            <button onClick={toggleRemoved} className="rounded-full bg-black/65 px-4 py-2 text-xs font-bold text-red-200 backdrop-blur">
              {removed ? "Restore" : "Remove"}
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/70 px-5 py-3 text-xs backdrop-blur">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-cyan-300/70">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            Floor placement indicator appears inside AR
          </div>
        </section>

        <aside className="flex flex-col justify-between border-l border-white/10 bg-[#11131a] p-6 sm:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-300">View in your room</p>
            <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-sm text-white/45">{product.category} · {product.ar.dimensions}</p>
            <div className={`mt-5 rounded-xl border p-4 ${compatibility.kind === "ready" ? "border-emerald-400/25 bg-emerald-400/10" : "border-amber-300/20 bg-amber-300/5"}`}>
              <p className={`text-xs font-bold ${compatibility.kind === "ready" ? "text-emerald-300" : "text-amber-200"}`}>{compatibility.title}</p>
              <p className="mt-1 text-xs leading-5 text-white/60">{message}</p>
            </div>
            {failed && (
              <button onClick={retryModel} className="mt-3 rounded-lg border border-white/15 px-4 py-2 text-xs font-bold text-white/75">
                Retry model
              </button>
            )}

            <div className="mt-7 space-y-5">
              {steps.map(([number, title, text]) => (
                <div key={number} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-600 text-xs font-bold">{number}</span>
                  <div>
                    <h2 className="text-sm font-bold">{title}</h2>
                    <p className="mt-1 text-xs leading-5 text-white/45">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={launchAr}
              disabled={!loaded || removed}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7048ff] to-[#16bed3] px-5 py-4 text-sm font-bold shadow-[0_14px_35px_rgba(92,67,255,.28)] disabled:cursor-wait disabled:opacity-45"
            >
              <CubeIcon className="h-5 w-5" />
              {supported === false ? "AR unavailable on this browser" : "Start AR placement"}
            </button>
            <p className="mt-3 text-center text-[10px] leading-4 text-white/35">
              Android uses WebXR or Scene Viewer. iPhone uses Quick Look with generated USDZ when a custom USDZ is not supplied.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
