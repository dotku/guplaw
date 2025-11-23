import Hero from "@/components/Hero";
import LegalCategories from "@/components/LegalCategories";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import CaseIntakeForm from "@/components/CaseIntakeForm";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Analytics />
      <Hero />
      <AIChat />
      <LegalCategories />
      <HowItWorks />
      <Pricing />
      <CaseIntakeForm />
      <Footer />
    </main>
  );
}
