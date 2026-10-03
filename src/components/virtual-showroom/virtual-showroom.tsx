"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import Link from "next/link";
import { Suspense, useState } from "react";

type Hotspot = { id: string; label: string; position: [number, number, number]; description: string };

const hotspots: Hotspot[] = [
  { id: "living", label: "Living collection", position: [-1.2, 1.25, 0.3], description: "Explore lounge seating and statement pieces." },
  { id: "dining", label: "Dining collection", position: [1.45, 1.1, -0.15], description: "Discover warm wood tables and dining chairs." },
  { id: "materials", label: "Materials library", position: [0, 1.7, -1.35], description: "Compare finishes, colours and textures." },
];

function House() {
  const { scene } = useGLTF("/models/free-house-quaternius.glb");
  return <primitive object={scene} scale={2.8} position={[0, -1.3, 0]} />;
}

function Hotspots({ active, onSelect }: { active: string | null; onSelect: (id: string) => void }) {
  return <>{hotspots.map((spot) => <Html key={spot.id} position={spot.position} center distanceFactor={8}>
    <button onClick={() => onSelect(spot.id)} className="group flex items-center gap-2 whitespace-nowrap text-left">
      <span className="grid h-8 w-8 place-items-center rounded-full border border-white/70 bg-cyan-400/80 text-sm font-black text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.75)] transition group-hover:scale-110">+</span>
      <span className={"rounded-full border border-white/20 bg-slate-950/80 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md " + (active === spot.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>{spot.label}</span>
    </button>
  </Html>)}</>;
}

export function VirtualShowroom() {
  const [active, setActive] = useState<string | null>(null);
  const selected = hotspots.find((spot) => spot.id === active);

  return <main className="relative h-dvh w-full overflow-hidden bg-[#071018] text-white">
    <Canvas camera={{ position: [5.8, 3.4, 7.2], fov: 42 }} dpr={[1, 1.6]}>
      <color attach="background" args={["#071018"]} />
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.75} shadows={{ type: "contact", opacity: 0.45, blur: 2 }}>
          <House />
          <Hotspots active={active} onSelect={setActive} />
        </Stage>
      </Suspense>
      <OrbitControls makeDefault enablePan={false} minDistance={4} maxDistance={14} minPolarAngle={0.45} maxPolarAngle={1.48} />
    </Canvas>

    <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/35 px-5 py-4 backdrop-blur-md sm:px-10">
      <Link href="/" className="pointer-events-auto text-sm font-bold tracking-[.28em]">VISTARA<span className="ml-2 text-[9px] font-normal tracking-[.18em] text-white/45">VIRTUAL SHOWROOM</span></Link>
      <div className="pointer-events-auto flex items-center gap-2"><button onClick={() => void document.documentElement.requestFullscreen?.()} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10">Fullscreen</button><Link href="/" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-xl text-white/75">×</Link></div>
    </header>

    <section className="pointer-events-none absolute left-5 top-24 z-10 max-w-sm sm:left-10">
      <p className="text-[10px] font-bold uppercase tracking-[.25em] text-cyan-300">Immersive collection 01</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Step inside<br />the new home.</h1>
      <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">Drag to look around. Select the glowing points to explore each collection.</p>
    </section>

    {selected && <aside className="absolute bottom-6 left-1/2 z-20 w-[min(380px,calc(100%-32px))] -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-8 sm:translate-x-0"><button onClick={() => setActive(null)} className="absolute right-4 top-3 text-xl text-white/45">×</button><p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Selected area</p><h2 className="mt-2 text-xl font-semibold">{selected.label}</h2><p className="mt-2 text-sm leading-6 text-white/60">{selected.description}</p><Link href="/products" className="mt-4 block rounded-xl bg-cyan-400 px-4 py-3 text-center text-sm font-bold text-slate-950">Explore products →</Link></aside>}
    <div className="pointer-events-none absolute bottom-6 left-5 z-10 hidden rounded-full border border-white/10 bg-slate-950/55 px-4 py-2 text-[11px] text-white/55 backdrop-blur-md sm:block">Drag to explore · Scroll to zoom · Click hotspots</div>
    <footer className="absolute bottom-3 right-5 z-10 text-[9px] text-white/35">House by Quaternius · CC0</footer>
  </main>;
}

useGLTF.preload("/models/free-house-quaternius.glb");
