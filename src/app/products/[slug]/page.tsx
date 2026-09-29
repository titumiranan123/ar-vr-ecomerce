import { notFound } from "next/navigation";
import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { ProductDetails } from "@/components/product-details/product-details";
import { products } from "@/components/products/products-data";

export function generateStaticParams(){return products.map(({slug})=>({slug}))}

export default async function ProductDetailsPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=products.find(item=>item.slug===slug);
  if(!product) notFound();
  return <main className="min-h-screen bg-[#f7f6f2] text-[#151515]"><div className="relative h-20 bg-[#0d0f14]"><Navbar /></div><ProductDetails product={product}/><Footer /></main>;
}
