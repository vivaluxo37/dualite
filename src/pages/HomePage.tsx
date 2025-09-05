import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { ValuePropositions } from "@/components/landing/ValuePropositions";
import { FeaturedBrokers } from "@/components/landing/FeaturedBrokers";
import { Faq } from "@/components/landing/Faq";

export function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Stats />
      <FeaturedBrokers />
      <ValuePropositions />
      <Features />
      <Testimonials />
      <Faq />
    </div>
  );
}
