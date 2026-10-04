"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Product } from "@/components/products/products-data";
import { CubeIcon } from "@/components/ui/icons";

type Stage = "closed" | "camera" | "processing" | "photo";
type Placement = { x: number; y: number; scale: number; rotate: number };

export function RoomTryOnButton({ product }: { product: Product }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [stage, setStage] = useState<Stage>("closed");
  const [roomPhoto, setRoomPhoto] = useState("");
  const [message, setMessage] = useState("Camera is ready to capture your room.");
  const [placement, setPlacement] = useState<Placement>({ x: 0, y: 0, scale: 1, rotate: 0 });

  useEffect(() => {
    if (stage === "photo") void import("@google/model-viewer");
  }, [stage]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (stage !== "camera") return;
    let cancelled = false;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser cannot access the camera.");
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setMessage("Room camera is on. Point it at the room and capture a photo.");
      } catch (caught) {
        setMessage(caught instanceof Error ? caught.message : "Camera permission was denied or unavailable.");
      }
    };

    void startCamera();
    return () => { cancelled = true; };
  }, [stage]);

  const openCamera = () => {
    setRoomPhoto("");
    setPlacement({ x: 0, y: 0, scale: 1, rotate: 0 });
    setMessage("Requesting room camera permission…");
    setStage("camera");
  };

  const captureRoom = async () => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    setStage("processing");
    setMessage("Processing the room photo…");
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setRoomPhoto(canvas.toDataURL("image/jpeg", 0.9));
    stopCamera();
    setMessage("Furniture preview ready. Drag it into position, then adjust size or rotation.");
    setStage("photo");
  };

  const close = () => {
    stopCamera();
    setStage("closed");
    setRoomPhoto("");
  };

  const updatePlacement = (change: Partial<Placement>) => setPlacement((current) => ({ ...current, ...change }));
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, originX: placement.x, originY: placement.y };
  };
  const dragFurniture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    updatePlacement({ x: dragRef.current.originX + event.clientX - dragRef.current.startX, y: dragRef.current.originY + event.clientY - dragRef.current.startY });
  };
  const stopDrag = () => { dragRef.current = null; };

  return <>
    <button type="button" onClick={openCamera} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#6c46ff]/35 bg-violet-50 px-5 py-3.5 text-sm font-bold text-[#5d3ce1] transition hover:bg-violet-100"><CubeIcon className="h-5 w-5"/> ঘরে বসিয়ে দেখুন</button>
    {stage !== "closed" && <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`View ${product.name} in your room`}>
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#11131a] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">NESTT room preview</p><h2 className="mt-1 text-lg font-bold">{product.name} ঘরে দেখুন</h2></div><button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-xl" aria-label="Close room preview">×</button></div>
        <div className="relative aspect-[4/3] overflow-hidden bg-black">
          {stage === "photo" && roomPhoto ? <><img src={roomPhoto} alt="Captured room" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute left-1/2 top-1/2 touch-none select-none" style={{ transform: `translate(calc(-50% + ${placement.x}px), calc(-50% + ${placement.y}px)) scale(${placement.scale}) rotate(${placement.rotate}deg)` }} onPointerDown={startDrag} onPointerMove={dragFurniture} onPointerUp={stopDrag} onPointerCancel={stopDrag}><model-viewer src={product.model} alt={`${product.name} furniture preview`} camera-orbit="0deg 75deg 105%" shadow-intensity="1.4" shadow-softness="0.9" loading="eager" reveal="auto" style={{ width: "260px", height: "210px", background: "transparent", pointerEvents: "none" }}/></div></> : <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover"/>}
          {stage === "processing" && <div className="absolute inset-0 grid place-items-center bg-black/65 text-center"><div><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300"/><p className="mt-4 text-sm">Processing room photo…</p></div></div>}
        </div>
        <div className="p-5"><p className="text-center text-xs leading-5 text-white/55">এটি Lenskart-এর মতো normal camera photo preview—AR session নয়। ছবি তোলার পর furniture-টি drag করে room-এর জায়গায় বসান।</p><p className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs text-white/70">{message}</p>{stage === "photo" && <div className="mt-4 grid grid-cols-4 gap-2"><button type="button" onClick={() => updatePlacement({ scale: Math.max(.55, placement.scale - .1) })} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold">− Size</button><button type="button" onClick={() => updatePlacement({ scale: Math.min(1.8, placement.scale + .1) })} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold">+ Size</button><button type="button" onClick={() => updatePlacement({ rotate: placement.rotate - 15 })} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold">↶ Rotate</button><button type="button" onClick={() => updatePlacement({ rotate: placement.rotate + 15 })} className="rounded-lg border border-white/15 px-3 py-2 text-sm font-bold">Rotate ↷</button></div>}{stage === "photo" && <div className="mt-4 flex gap-3"><button type="button" onClick={openCamera} className="flex-1 rounded-xl bg-gradient-to-r from-[#7048ff] to-[#16bed3] px-4 py-3 text-sm font-bold">Retake Photo</button><button type="button" onClick={close} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/75">Close</button></div>}{stage !== "photo" && <div className="mt-4 flex gap-3"><button type="button" onClick={captureRoom} disabled={stage !== "camera"} className="flex-1 rounded-xl bg-gradient-to-r from-[#7048ff] to-[#16bed3] px-4 py-3 text-sm font-bold disabled:cursor-wait disabled:opacity-45">Take Room Photo</button><button type="button" onClick={close} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/75">Close</button></div>}<p className="mt-3 text-center text-[10px] leading-4 text-white/35">Camera permission works on localhost or HTTPS; no AR-capable phone is required for this photo preview.</p></div>
      </div>
    </div>}
  </>;
}
