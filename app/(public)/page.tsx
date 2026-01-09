import { CTASection } from "@/components/cta-section";
import { FeaturesGrid } from "@/components/features-grid";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { StatsSection } from "@/components/stats-section";

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