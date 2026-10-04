import { CubeIcon } from "@/components/ui/icons";
import type { Product } from "@/components/products/products-data";
import { FurnitureModel, FurnitureThumbnail } from "@/components/products/furniture-model";
const views=[
 {label:"Front",orbit:"0deg 75deg 105%",position:"object-center"},
 {label:"Side",orbit:"90deg 75deg 105%",position:"object-left"},
 {label:"Back",orbit:"180deg 75deg 105%",position:"object-right"},
 {label:"Detail",orbit:"25deg 68deg 55%",position:"object-center"},
 {label:"Auto spin",orbit:"0deg 75deg 105%",position:"object-center"},
];
export function ProductGallery({product,activeImage,onSelect}:{product:Product;activeImage:number;onSelect:(index:number)=>void}){
 const activeView=views[activeImage] ?? views[0];
 return <div><div className="group relative aspect-[1.08/1] overflow-hidden rounded-2xl bg-[#dedbd5]"><FurnitureModel src={product.model} poster={product.image} alt={`Interactive 3D model of ${product.name}, ${activeView.label} view`} autoRotate={activeImage===4} cameraOrbit={activeView.orbit}/><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5"/><span className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/65 px-4 py-2 text-xs font-semibold text-white backdrop-blur"><CubeIcon className="h-4 w-4"/> {activeView.label} view</span><button aria-label="Fullscreen viewer" className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white">⛶</button><p className="pointer-events-none absolute bottom-5 left-5 rounded-full bg-black/55 px-3 py-1.5 text-xs text-white/85 backdrop-blur">Drag to rotate · Scroll to zoom</p></div><div className="mt-3 grid grid-cols-5 gap-2">{views.map((view,index)=><button key={view.label} type="button" aria-label={`Show ${view.label} view`} aria-pressed={activeImage===index} onClick={()=>onSelect(index)} className={`group/thumb relative aspect-[1.25/1] overflow-hidden rounded-xl border-2 bg-[#e7e3dc] ${activeImage===index?"border-[#6c46ff] shadow-[0_0_0_2px_rgba(108,70,255,.15)]":"border-transparent"}`}><FurnitureThumbnail src={product.model} alt={`${product.name} ${view.label} thumbnail`} cameraOrbit={view.orbit} autoRotate={index===4}/><span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2 pb-1.5 pt-5 text-[10px] font-bold text-white">{index===4?"▶ ":""}{view.label}</span></button>)}</div></div>
}
