import { ArSteps } from "@/components/home/ar-steps";
import { Categories } from "@/components/home/categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { Navbar } from "@/components/home/navbar";
import { Newsletter } from "@/components/home/newsletter";
import { Testimonials } from "@/components/home/testimonials";
import { VrShowroom } from "@/components/home/vr-showroom";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f6f2] text-[#151515]">
      <Navbar /><Hero /><FeaturedProducts /><Categories /><ArSteps />
      <VrShowroom /><Testimonials /><Newsletter /><Footer />
    </main>
  );
}
