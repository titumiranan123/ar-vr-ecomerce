"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";

type Item = { id: string; type: string; name: string; model: string; position: [number, number, number]; rotation: number; scale: number };
type CatalogItem = Omit<Item, "id" | "position" | "rotation"> & { width: number; depth: number; category: string };
type DesignSuggestion = { type: string; reason: string };

const catalog: CatalogItem[] = [
  { type: "chair", name: "Aero Lounge Chair", model: "/models/modern-arm-chair.glb", scale: 1.1, width: 1.2, depth: 1.2, category: "chair" },
  { type: "table", name: "Terra Coffee Table", model: "/models/wooden-table.glb", scale: 1.25, width: 1.8, depth: 1, category: "table" },
  { type: "shelf", name: "Rye Display Shelf", model: "/models/wooden-shelves.glb", scale: 1.2, width: 1.4, depth: .6, category: "shelf" },
  { type: "stool", name: "Ember Wooden Stool", model: "/models/wooden-stool.glb", scale: 1, width: .7, depth: .7, category: "chair" },
  { type: "side-chair", name: "Luna Side Chair", model: "/models/plastic-chair.glb", scale: .9, width: 1, depth: 1, category: "chair" },
  { type: "display", name: "Oak Display Wall", model: "/models/steel-shelves.glb", scale: 1, width: 1.4, depth: .6, category: "shelf" },
];
const floors = ["#cfc4b2", "#8d7660", "#62676a", "#ddd8cf"];

function interiorLayout(roomWidth: number, roomLength: number, roomItems: Item[]) {
  const x = Math.min(1.65, roomWidth / 2 - 0.85);
  const z = Math.min(2.25, roomLength / 2 - 0.8);
  const positions: Record<string, [number, number, number]> = {
    chair: [-x, 0, 0.15],
    "side-chair": [x, 0, 0.15],
    table: [0, 0, 0.25],
    shelf: [0, 0, -z],
    display: [x, 0, -z],
    stool: [-x * 0.35, 0, 1.45],
  };
  return roomItems.map((item, index) => ({
    ...item,
    position: positions[item.type] || [((index % 3) - 1) * 1.25, 0, Math.floor(index / 3) * 1.25 - 1],
    rotation: item.type === "shelf" || item.type === "display" ? 0 : item.type === "table" ? 0 : Math.PI * 0.08,
  }));
}

function Product({ item, selected, onSelect, dragging, onDragStart }: { item: Item; selected: boolean; onSelect: () => void; dragging: boolean; onDragStart: () => void }) {
  const { scene } = useGLTF(item.model);
  const cloned = useMemo(() => scene.clone(), [scene]);
  return <primitive object={cloned} position={item.position} rotation={[0, item.rotation, 0]} scale={item.scale} onClick={(event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect(); }} onPointerDown={(event: { stopPropagation: () => void }) => { event.stopPropagation(); onDragStart(); }} onPointerOver={() => { document.body.style.cursor = "grab"; }} onPointerOut={() => { document.body.style.cursor = "default"; }}>
    {selected && <mesh position={[0, .05, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.45, .5, 32]} /><meshBasicMaterial color="#22d3ee" transparent opacity={dragging ? .9 : .55} /></mesh>}
  </primitive>;
}

function PlannerScene({ width, length, wallHeight, wallColor, floorColor, items, selected, setSelected, moveItem, dragging, setDragging }: { width: number; length: number; wallHeight: number; wallColor: string; floorColor: string; items: Item[]; selected: string | null; setSelected: (id: string | null) => void; moveItem: (point: [number, number, number]) => void; dragging: boolean; setDragging: (value: boolean) => void }) {
  return <>
    <ambientLight intensity={1.2} />
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={(event) => { if (dragging) { moveItem([event.point.x, 0, event.point.z]); setDragging(false); } else setSelected(null); }} onPointerMove={(event) => { if (dragging) moveItem([event.point.x, 0, event.point.z]); }}><planeGeometry args={[width, length]} /><meshStandardMaterial color={floorColor} roughness={.82} /></mesh>
      <mesh position={[0, wallHeight / 2, -length / 2]}><boxGeometry args={[width, wallHeight, .12]} /><meshStandardMaterial color={wallColor} /></mesh>
      <mesh position={[-width / 2, wallHeight / 2, 0]}><boxGeometry args={[.12, wallHeight, length]} /><meshStandardMaterial color={wallColor} /></mesh>
      <mesh position={[width / 2, wallHeight / 2, 0]}><boxGeometry args={[.12, wallHeight, length]} /><meshStandardMaterial color={wallColor} /></mesh>
      {items.map((item) => <Product key={item.id} item={item} selected={item.id === selected} onSelect={() => setSelected(item.id)} dragging={dragging && item.id === selected} onDragStart={() => { setSelected(item.id); setDragging(true); }} />)}
    </group>
    <gridHelper args={[Math.max(width, length), Math.max(width, length) * 2, "#ffffff", "#ffffff"]} position={[0, .012, 0]} material-transparent material-opacity={.12} />
    <OrbitControls makeDefault enablePan={!dragging} minDistance={3} maxDistance={18} target={[0, 0, 0]} />
  </>;
}

export function RoomPlanner() {
  const [width, setWidth] = useState(6);
  const [length, setLength] = useState(8);
  const [wallHeight, setWallHeight] = useState(3);
  const [wallColor, setWallColor] = useState("#f1eee8");
  const [floorColor, setFloorColor] = useState(floors[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [arranging, setArranging] = useState(false);
  const [message, setMessage] = useState("");
  const [designStyle, setDesignStyle] = useState("");
  const [suggestions, setSuggestions] = useState<DesignSuggestion[]>([]);
  const addItem = (product: CatalogItem) => setItems((current) => { const existing = current.find((item) => item.type === product.type); if (existing) { setSelected(existing.id); return current; } const next = { ...product, id: `${product.type}-${Date.now()}`, position: [0, 0, 0] as [number, number, number], rotation: 0 }; const arranged = interiorLayout(width, length, [...current, next]); setSelected(next.id); return arranged; });
  const reset = () => { setItems([]); setSelected(null); };
  const rotate = (amount: number) => setItems((current) => current.map((item) => item.id === selected ? { ...item, rotation: item.rotation + amount } : item));
  const remove = () => { setItems((current) => current.filter((item) => item.id !== selected)); setSelected(null); setSuggestions([]); };
  const moveItem = (point: [number, number, number]) => setItems((current) => current.map((item) => item.id === selected ? { ...item, position: [Math.max(-width / 2 + .5, Math.min(width / 2 - .5, point[0])), 0, Math.max(-length / 2 + .5, Math.min(length / 2 - .5, point[2]))] } : item));
  const arrangeWithGemini = async () => {
    if (!items.length) { setMessage("Add products first."); return; }
    setArranging(true); setMessage("");
    try {
      const prompt = `Return only JSON with style, wallColor, floorColor, lighting, placements and suggestions. Design a complete room ${width}m wide and ${length}m long using these selected furniture items. Keep them inside, do not overlap, leave walking space. placements must contain each exact id. Suggest up to 2 complementary types from chair, table, shelf, stool. Items: ${JSON.stringify(items)}`;
      const response = await fetch(`${process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434"}/api/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: process.env.NEXT_PUBLIC_OLLAMA_MODEL || "gemma3:4b", prompt, stream: false, format: "json", options: { temperature: .3 } }), signal: AbortSignal.timeout(30000) });
      const ollama = await response.json() as { response?: string };
      const data = JSON.parse(ollama.response || "{}") as { placements?: Array<{ id: string; x: number; z: number; rotation: number }>; style?: string; wallColor?: string; floorColor?: string; suggestions?: DesignSuggestion[]; error?: string };
      if (!response.ok || !data.placements) throw new Error(data.error || "AI offline - smart rules used");
      if (data.wallColor) setWallColor(data.wallColor); if (data.floorColor) setFloorColor(data.floorColor); setDesignStyle(data.style || "Designed room"); setSuggestions(data.suggestions || []);
      setItems((current) => {
        const additions = (data.suggestions || []).map((suggestion) => catalog.find((product) => product.type === suggestion.type)).filter((product): product is CatalogItem => product !== undefined).filter((product) => !current.some((item) => item.type === product.type)).map((product) => ({ ...product, id: `${product.type}-${Date.now()}-${Math.random()}`, position: [0, 0, 0] as [number, number, number], rotation: 0 }));
        const merged = [...current, ...additions];
        return merged.map((item, index) => {
          const placement = data.placements?.find((entry) => entry.id === item.id);
          if (placement) return { ...item, position: [Math.max(-width / 2 + .5, Math.min(width / 2 - .5, placement.x)), 0, Math.max(-length / 2 + .5, Math.min(length / 2 - .5, placement.z))], rotation: placement.rotation };
          return interiorLayout(width, length, merged)[index];
        });
      });
      setMessage("Your room has been designed with the selected products.");
    } catch { setItems((current) => interiorLayout(width, length, current)); setDesignStyle("Warm contemporary layout"); setMessage("AI unavailable — a complete smart interior layout was applied locally."); }
    finally { setArranging(false); }
  };

  return <main className="flex h-dvh flex-col bg-[#f5f3ee] text-[#171717] lg:flex-row">
    <aside className="z-10 w-full shrink-0 overflow-y-auto border-b border-black/10 bg-white p-5 lg:w-[330px] lg:border-b-0 lg:border-r lg:p-6">
      <div className="flex items-center justify-between"><Link href="/" className="text-sm font-bold tracking-[.25em]">VISTARA</Link><Link href="/" className="text-xl text-black/40">×</Link></div>
      <p className="mt-8 text-[10px] font-bold uppercase tracking-[.2em] text-violet-600">3D room planner</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Make your space.</h1><p className="mt-2 text-sm leading-6 text-black/55">Set the room size, style the surfaces, then drag furniture into place.</p>
      <div className="mt-7 grid grid-cols-2 gap-3"><label className="text-xs font-semibold">Width (m)<input type="number" min="3" max="15" step=".5" value={width} onChange={(event) => setWidth(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2" /></label><label className="text-xs font-semibold">Length (m)<input type="number" min="3" max="15" step=".5" value={length} onChange={(event) => setLength(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2" /></label></div>
      <label className="mt-4 block text-xs font-semibold">Wall height (m)<input type="range" min="2.4" max="5" step=".1" value={wallHeight} onChange={(event) => setWallHeight(Number(event.target.value))} className="mt-3 w-full accent-violet-600" /><span className="text-black/50">{wallHeight.toFixed(1)}m</span></label>
      <div className="mt-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-black/45">Wall colour</p><div className="mt-3 flex gap-2"><input type="color" value={wallColor} onChange={(event) => setWallColor(event.target.value)} className="h-9 w-12 cursor-pointer rounded border-0" /><span className="self-center text-xs text-black/50">{wallColor}</span></div></div>
      <div className="mt-6"><p className="text-xs font-bold uppercase tracking-[.15em] text-black/45">Floor finish</p><div className="mt-3 flex gap-2">{floors.map((color) => <button key={color} aria-label={`Select floor ${color}`} onClick={() => setFloorColor(color)} className={`h-9 w-9 rounded-full border-2 ${floorColor === color ? "border-violet-600" : "border-white"}`} style={{ backgroundColor: color }} />)}</div></div>
      <div className="mt-7 border-t border-black/10 pt-6"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.15em] text-black/45">Furniture</p><span className="text-xs text-black/40">{items.length} placed</span></div><div className="mt-3 grid grid-cols-2 gap-2">{catalog.map((product) => <button key={product.type} onClick={() => addItem(product)} className="rounded-xl border border-black/10 bg-[#faf9f6] p-3 text-left text-xs font-semibold transition hover:-translate-y-0.5 hover:border-violet-400"><span className="mb-2 block h-10 rounded-lg bg-gradient-to-br from-[#e9e3d8] to-[#c5b8a8]" />{product.name}<span className="mt-1 block text-[10px] font-normal text-black/45">Add to room +</span></button>)}</div></div>
      {selected && <div className="mt-6 flex gap-2"><button onClick={() => rotate(-Math.PI / 8)} className="flex-1 rounded-lg border border-black/15 py-2 text-xs font-semibold">↶ Rotate</button><button onClick={() => rotate(Math.PI / 8)} className="flex-1 rounded-lg border border-black/15 py-2 text-xs font-semibold">Rotate ↷</button><button onClick={remove} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Delete</button></div>}
      <button onClick={reset} className="mt-6 w-full rounded-xl bg-[#181818] py-3 text-xs font-bold text-white">Reset room</button>
      <button onClick={() => void arrangeWithGemini()} disabled={arranging || items.length === 0} className="mt-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{arranging ? "Designing your room…" : "✦ Design my room with AI"}</button>
      {message && <p className="mt-3 rounded-lg bg-black/[.04] px-3 py-2 text-center text-xs text-black/60">{message}</p>}
      {designStyle && <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50 p-3"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-violet-600">AI design</p><p className="mt-1 text-sm font-semibold">{designStyle}</p></div>}
      {suggestions.length > 0 && <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 p-3"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-cyan-700">Suggested for your room</p>{suggestions.map((suggestion) => { const product = catalog.find((item) => item.type === suggestion.type); return product ? <button key={suggestion.type} onClick={() => addItem(product)} className="mt-2 block w-full rounded-lg bg-white p-2 text-left text-xs shadow-sm"><span className="font-bold">+ {product.name}</span><span className="mt-1 block text-[10px] text-black/50">{suggestion.reason}</span></button> : null; })}</div>}
    </aside>
    <section className="relative min-h-0 flex-1"><Canvas camera={{ position: [8, 7, 9], fov: 45 }} shadows dpr={[1, 1.5]}><Suspense fallback={null}><Stage environment="city" intensity={.65} shadows={{ type: "contact", opacity: .35, blur: 2 }}><PlannerScene width={width} length={length} wallHeight={wallHeight} wallColor={wallColor} floorColor={floorColor} items={items} selected={selected} setSelected={setSelected} moveItem={moveItem} dragging={dragging} setDragging={setDragging} /></Stage></Suspense></Canvas><div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-black/10 bg-white/75 px-5 py-2 text-[11px] text-black/55 shadow-sm backdrop-blur-md">Drag furniture · Scroll to zoom · Click empty floor to deselect</div></section>
  </main>;
}

catalog.forEach((item) => useGLTF.preload(item.model));
