"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/components/products/products-data";
import { ProductGallery } from "./product-gallery";
import { PurchasePanel } from "./purchase-panel";
import { ProductStory } from "./product-story";
import { ArGuide } from "./ar-guide";
import { ProductReviews } from "./product-reviews";
import { RelatedProducts } from "./related-products";

export function ProductDetails({product}:{product:Product}){
 const [activeImage,setActiveImage]=useState(0);
 return <><div className="page-shell py-8"><p className="mb-7 text-xs text-black/45"><Link href="/">Home</Link> &nbsp;›&nbsp; <Link href="/products">Products</Link> &nbsp;›&nbsp; {product.category} &nbsp;›&nbsp; <strong className="text-black/70">{product.name}</strong></p><div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr]"><ProductGallery product={product} activeImage={activeImage} onSelect={setActiveImage}/><PurchasePanel product={product}/></div></div><ProductStory product={product}/><ArGuide product={product}/><ProductReviews/><RelatedProducts current={product}/></>
}
