import Hero from '@/components/Hero';
import LegalCategories from '@/components/LegalCategories';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import CaseIntakeForm from '@/components/CaseIntakeForm';
import AIChat from '@/components/AIChat';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <LegalCategories />
      <HowItWorks />
      <Pricing />
      <CaseIntakeForm />
      <AIChat />
      <Footer />
    </main>
  );
}
