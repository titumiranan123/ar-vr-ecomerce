"use client";
import dynamic from "next/dynamic";
const VrShowroom=dynamic(()=>import("./vr-showroom").then(mod=>mod.VrShowroom),{ssr:false,loading:()=> <div className="grid min-h-screen place-items-center bg-[#08090d] text-white"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#6c46ff]"/><p className="mt-4 text-sm text-white/55">Preparing the showroom…</p></div></div>});
export function ShowroomLoader(){return <VrShowroom/>}
