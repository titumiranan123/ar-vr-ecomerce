import type { Metadata } from "next";

const matterportSampleUrl = "https://my.matterport.com/show/?m=UoYSVEXV1GQ";

export const metadata: Metadata = {
  title: "Matterport Demo | Vistara",
  description: "Explore a Matterport sample space inside the Vistara demo.",
};

export default function MatterportPage() {
  return (
    <main className="min-h-screen bg-[#111114] text-white">
      <header className="flex items-center justify-between gap-6 border-b border-white/10 px-5 py-4 sm:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300">
            Vistara demo
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
            Matterport Virtual Showroom
          </h1>
        </div>
        <a
          href={matterportSampleUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-cyan-300 hover:text-cyan-200"
        >
          Open separately
        </a>
      </header>

      <section className="mx-auto flex w-full max-w-[1600px] flex-col px-3 py-3 sm:px-6 sm:py-6">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/30">
          <iframe
            src={matterportSampleUrl}
            title="Matterport virtual showroom sample"
            allow="fullscreen; xr-spatial-tracking"
            allowFullScreen
            className="h-[calc(100vh-122px)] min-h-[560px] w-full border-0"
          />
        </div>
        <p className="px-1 pt-3 text-xs text-white/45">
          Demo sample powered by Matterport. Replace this model URL with the client&apos;s own space for production.
        </p>
      </section>
    </main>
  );
}
