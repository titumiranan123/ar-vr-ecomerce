import Link from "next/link";
import type { ShowroomProduct } from "./showroom-data";

type Props = {
  selected: ShowroomProduct | null; onClose: () => void; onEnterVr: () => void;
  onExitVr: () => void; isPresenting: boolean;
  onRotateLeft: () => void; onRotateRight: () => void; onResetSelected: () => void; onResetAll: () => void;
  vrSupported: boolean | null; status: string;
};

export function ShowroomUi({ selected, onClose, onEnterVr, onExitVr, isPresenting, onRotateLeft, onRotateRight, onResetSelected, onResetAll, vrSupported, status }: Props) {
  return <div className="pointer-events-none absolute inset-0 z-10 text-white">
    <header className="pointer-events-auto flex items-center justify-between border-b border-white/10 bg-black/35 px-5 py-4 backdrop-blur-md sm:px-8">
      <Link href="/" className="text-lg font-semibold tracking-[.3em]">VISTARA<span className="block text-[6px] tracking-[.22em] text-white/45">IMMERSIVE SHOWROOM</span></Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onResetAll} className="rounded-full border border-white/20 bg-black/30 px-4 py-2.5 text-xs font-semibold text-white/75 hover:bg-white/10">Reset room</button>
        <button onClick={isPresenting ? onExitVr : onEnterVr} disabled={vrSupported === false} className="rounded-full bg-gradient-to-r from-[#6c46ff] to-[#16bfd6] px-5 py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-45">
          ◉ {isPresenting ? "Exit VR" : vrSupported === false ? "VR unavailable" : "Enter VR"}
        </button>
        <Link href="/products" className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/30 text-xl" aria-label="Exit showroom">×</Link>
      </div>
    </header>
    <div className="absolute left-5 top-24 max-w-xs rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur-md sm:left-8">
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">Virtual collection 01</p>
      <h1 className="mt-2 text-2xl font-bold">The Modern Room</h1>
      <p className="mt-2 text-xs leading-5 text-white/55">Select and drag furniture to rearrange the room. Seating can tuck up to 50% under tables. Your layout saves automatically.</p>
    </div>
    <div className="absolute bottom-5 left-5 hidden rounded-full border border-white/10 bg-black/50 px-5 py-3 text-[11px] text-white/65 backdrop-blur-md lg:block">
      Drag furniture: move &nbsp;•&nbsp; Mouse drag empty space: look &nbsp;•&nbsp; W A S D: walk &nbsp;•&nbsp; Scroll: zoom
    </div>
    {selected && <aside className="pointer-events-auto absolute bottom-5 right-5 w-[min(360px,calc(100%-40px))] rounded-2xl border border-white/15 bg-[#11131a]/90 p-6 shadow-2xl backdrop-blur-xl">
      <button onClick={onClose} className="absolute right-4 top-3 text-xl text-white/45" aria-label="Close product panel">×</button>
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-violet-300">Selected piece</p>
      <h2 className="mt-2 text-2xl font-bold">{selected.name}</h2>
      <p className="mt-1 text-lg font-semibold text-cyan-300">{selected.price}</p>
      <p className="mt-3 text-sm leading-6 text-white/55">{selected.description}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={onRotateLeft} className="rounded-lg border border-white/15 bg-white/5 py-2 text-xs hover:bg-white/10">↶ Rotate</button>
        <button onClick={onRotateRight} className="rounded-lg border border-white/15 bg-white/5 py-2 text-xs hover:bg-white/10">Rotate ↷</button>
        <button onClick={onResetSelected} className="rounded-lg border border-white/15 bg-white/5 py-2 text-xs hover:bg-white/10">Reset</button>
      </div>
      <Link href={`/products/${selected.slug}`} className="mt-3 block rounded-xl bg-[#6c46ff] px-5 py-3 text-center text-sm font-bold">View Product Details →</Link>
    </aside>}
    {status && <div className="absolute left-1/2 top-24 -translate-x-1/2 rounded-full bg-amber-400 px-5 py-2 text-xs font-bold text-black shadow-lg">{status}</div>}
  </div>;
}
