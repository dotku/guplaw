import Hero from "@/components/Hero";
import LegalCategories from "@/components/LegalCategories";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import CaseIntakeFormSection from "@/components/CaseIntakeFormSection";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Analytics />
      <Navbar />
      <Hero />
      <AIChat />
      <LegalCategories />
      <HowItWorks />
      <Pricing />
      <CaseIntakeFormSection />
      <Footer />
    </main>
  );
}
