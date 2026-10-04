"use client";
import { useState } from "react";
import Link from "next/link";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
const links = ["Home", "Products", "AR Experience", "About"];
const hrefs = ["/", "/products", "/#ar", "/#about"];
export function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 text-white"><div className="page-shell flex h-20 items-center justify-between"><Link href="/" className="relative z-10 text-xl font-semibold tracking-[.35em]">NESTT<span className="mt-1 block text-[7px] tracking-[.22em] text-white/60">FURNITURE BEYOND SPACE</span></Link><nav className="hidden items-center gap-9 text-sm md:flex">{links.map((link,i)=><Link key={link} href={hrefs[i]} className="transition hover:text-violet-300">{link}</Link>)}</nav><div className="relative z-10 flex items-center gap-4"><button aria-label="Search"><SearchIcon className="h-5 w-5"/></button><button aria-label="Shopping bag" className="relative"><BagIcon className="h-5 w-5"/><span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#6c46ff] text-[9px]">2</span></button><button className="md:hidden" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<CloseIcon/>:<MenuIcon/>}</button></div></div>{open&&<nav className="glass border-t border-white/10 px-6 py-6 md:hidden">{links.map((link,i)=><Link onClick={()=>setOpen(false)} key={link} href={hrefs[i]} className="block border-b border-white/10 py-3">{link}</Link>)}</nav>}</header>;
}
