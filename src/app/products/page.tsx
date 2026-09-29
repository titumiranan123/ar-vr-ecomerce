import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { ProductCatalog } from "@/components/products/product-catalog";
import { ProductsHero } from "@/components/products/products-hero";

export default function ProductsPage() {
  return <main className="min-h-screen bg-[#f7f6f2] text-[#151515]"><Navbar /><ProductsHero /><ProductCatalog /><Footer /></main>;
}
