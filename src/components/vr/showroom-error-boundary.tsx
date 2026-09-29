"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export class ShowroomErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("VR showroom render failed", error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="grid h-dvh place-items-center bg-[#08090d] px-6 text-center text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-red-300">Showroom unavailable</p>
          <h1 className="mt-3 text-3xl font-bold">The 3D scene could not start.</h1>
          <p className="mt-3 text-sm text-white/55">Check WebGL support and your connection, then try again.</p>
          <button onClick={() => window.location.reload()} className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold">
            Reload showroom
          </button>
        </div>
      </div>
    );
  }
}
