import { CTASection } from "@/components/cta-section";
import { FeaturesGrid } from "@/components/features-grid";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { StatsSection } from "@/components/stats-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Home',
  description: 'Calculate your solar savings instantly with PrimeSolar. Get personalized quotes for solar panels, batteries, and installation in South Africa. Start your journey to clean, affordable energy today.',
  openGraph: {
    title: 'PrimeSolar - Solar Panel Installation & Energy Solutions in South Africa',
    description: 'Calculate your solar savings instantly. Get personalized quotes for solar panels and batteries.',
    url: 'https://primesolar.co.za',
  },
  alternates: {
    canonical: 'https://primesolar.co.za',
  },
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturesGrid />
      <CTASection />
    </main>
  )
}