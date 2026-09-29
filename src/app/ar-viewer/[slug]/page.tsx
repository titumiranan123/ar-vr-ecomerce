import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArViewer } from "@/components/ar/ar-viewer";
import { products } from "@/components/products/products-data";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return {
    title: product ? `View ${product.name} in AR | Vistara` : "AR Viewer | Vistara",
    description: product ? `Place ${product.name} at true scale in your room.` : "View furniture in augmented reality.",
  };
}

export default async function ArViewerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ArViewer product={product} />;
}
