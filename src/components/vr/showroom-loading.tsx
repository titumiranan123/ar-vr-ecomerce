import { useProgress } from "@react-three/drei";

export function ShowroomLoading() {
  const { active, progress, errors } = useProgress();
  if (!active && errors.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-[#08090d]/85 text-white backdrop-blur-sm">
      <div className="w-[min(360px,80vw)] text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[.24em] text-cyan-300">
          Loading immersive assets
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 transition-[width]" style={{ width: `${Math.round(progress)}%` }} />
        </div>
        <p className="mt-2 text-xs text-white/45">{Math.round(progress)}%</p>
        {errors.length > 0 && <p className="mt-3 text-xs text-red-300">A 3D asset could not be loaded.</p>}
      </div>
    </div>
  );
}
