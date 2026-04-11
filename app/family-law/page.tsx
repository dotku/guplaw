import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PracticeAreaTemplate from '@/components/PracticeAreaTemplate';
import { getPracticeArea } from '@/lib/practiceAreas';

const area = getPracticeArea('family-law');

export const metadata: Metadata = {
  title: area?.metadata.title,
  description: area?.metadata.description,
  keywords: area?.metadata.keywords,
  alternates: { canonical: '/family-law' },
  openGraph: {
    title: area?.metadata.title,
    description: area?.metadata.description,
    url: '/family-law',
    siteName: 'GPULaw',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: area?.metadata.title,
    description: area?.metadata.description,
  },
};

export default function FamilyLawPage() {
  if (!area) notFound();
  return <PracticeAreaTemplate area={area} />;
}
