import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { products } from "@/components/products/products-data";
import { ArrowIcon } from "@/components/ui/icons";

export function FeaturedProducts() {
  return (
    <section id="products" className="section-pad bg-[#f7f6f2]">
      <div className="page-shell">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow text-black/45">Curated for you</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Featured Products</h2>
          </div>
          <Link href="/products" className="hidden items-center gap-2 text-sm font-semibold sm:flex">
            View all products <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <Link href="/products" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold sm:hidden">
          View all products <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
