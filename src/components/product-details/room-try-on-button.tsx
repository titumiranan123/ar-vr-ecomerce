"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/components/products/products-data";
import { CubeIcon } from "@/components/ui/icons";

type ModelViewerElement = HTMLElement & {
  activateAR: () => Promise<void>;
  canActivateAR: boolean;
};

export function RoomTryOnButton({ product }: { product: Product }) {
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [message, setMessage] = useState("Loading the room preview…");

  useEffect(() => {
    if (open) void import("@google/model-viewer");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setLoaded(true);
      setSupported(Boolean(viewer.canActivateAR));
      setMessage(viewer.canActivateAR ? "Ready. Open the camera and scan your floor." : "Use this button on an AR-compatible mobile device.");
    };
    const handleStatus = (event: Event) => {
      const status = (event as Event & { detail?: { status?: string } }).detail?.status;
      if (status === "session-started") setMessage("Move your phone slowly so the room floor can be detected.");
      if (status === "object-placed") setMessage("Furniture placed at true scale. Walk around to inspect it.");
      if (status === "failed") setMessage("Camera access or floor detection failed. Check permission and HTTPS.");
      if (status === "not-presenting") setMessage("Room view ended. You can open the camera again.");
    };
    const handleError = () => setMessage("The furniture model could not be loaded.");

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("ar-status", handleStatus);
    viewer.addEventListener("error", handleError);
    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("ar-status", handleStatus);
      viewer.removeEventListener("error", handleError);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setLoaded(false);
    setSupported(null);
    setMessage("Loading the room preview…");
  };

  const openCamera = async () => {
    const viewer = viewerRef.current;
    if (!viewer || !loaded) return;
    if (!viewer.canActivateAR) {
      setSupported(false);
      setMessage("AR is unavailable here. Open this product on an AR-compatible mobile device.");
      return;
    }
    try {
      setMessage("Starting room camera and floor detection…");
      await viewer.activateAR();
    } catch {
      setMessage("Camera launch was cancelled. Please allow camera access and try again.");
    }
  };

  return <>
    <button type="button" onClick={() => setOpen(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#6c46ff]/35 bg-violet-50 px-5 py-3.5 text-sm font-bold text-[#5d3ce1] transition hover:bg-violet-100"><CubeIcon className="h-5 w-5"/> ঘরে বসিয়ে দেখুন</button>
    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`View ${product.name} in your room`}>
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#11131a] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">NESTT room preview</p><h2 className="mt-1 text-lg font-bold">{product.name} ঘরে দেখুন</h2></div><button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-xl" aria-label="Close room preview">×</button></div>
        <div className="relative h-[min(58vh,520px)] bg-gradient-to-br from-[#e8e4dc] to-[#bcb6aa]">
          <model-viewer ref={(node) => { viewerRef.current = node as ModelViewerElement | null; }} src={product.model} poster={product.image} alt={`3D ${product.name} room preview`} camera-controls ar ar-modes="webxr scene-viewer quick-look" ar-placement="floor" ar-scale="fixed" xr-environment environment-image="neutral" shadow-intensity="1.2" shadow-softness="0.8" loading="eager" reveal="auto" style={{ width: "100%", height: "100%", background: "transparent" }}><button slot="ar-button" className="hidden">Open room camera</button></model-viewer>
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/65 px-3 py-2 text-xs font-semibold backdrop-blur">True scale · {product.ar.dimensions}</span>
        </div>
        <div className="p-5"><p className="text-center text-xs leading-5 text-white/55">এটি face try-on নয়—camera দিয়ে মেঝে scan করে furniture বসবে। Camera চালু হলে ফোনটি ধীরে ধীরে room-এর floor-এর দিকে নড়ান।</p><p className={`mt-3 rounded-xl border p-3 text-center text-xs ${supported === false ? "border-amber-300/25 bg-amber-300/10 text-amber-100" : "border-white/10 bg-white/5 text-white/70"}`}>{message}</p><div className="mt-4 flex gap-3"><button type="button" onClick={openCamera} disabled={!loaded} className="flex-1 rounded-xl bg-gradient-to-r from-[#7048ff] to-[#16bed3] px-4 py-3 text-sm font-bold disabled:cursor-wait disabled:opacity-45"><CubeIcon className="mr-2 inline-block h-4 w-4"/>Open room camera</button><button type="button" onClick={close} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/75">Close</button></div><p className="mt-3 text-center text-[10px] leading-4 text-white/35">AR requires an AR-compatible phone and HTTPS. Desktop browsers show the 3D preview.</p></div>
      </div>
    </div>}
  </>;
}
