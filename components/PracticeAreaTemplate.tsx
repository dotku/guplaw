import Link from 'next/link';
import AIChat from '@/components/AIChat';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Pricing from '@/components/Pricing';
import CaseIntakeFormSection from '@/components/CaseIntakeFormSection';
import type { PracticeArea } from '@/lib/practiceAreas';
import { practiceAreas } from '@/lib/practiceAreas';

interface Props {
  area: PracticeArea;
}

export default function PracticeAreaTemplate({ area }: Props) {
  const relatedAreas = practiceAreas.filter((a) => a.slug !== area.slug).slice(0, 3);

  const initialGreeting = `Hi, I'm Richard — GPULaw's AI assistant for **${area.title}**. Ask me anything about ${area.shortDescription.toLowerCase()}, or pick one of the suggested questions below.\n\n*I provide general legal information, not legal advice. For specific matters, consult a licensed attorney — and you can escalate this conversation to one through GPULaw.*`;

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-700 hover:text-blue-900 font-semibold">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/#practice-areas" className="text-blue-700 hover:text-blue-900">
            Practice Areas
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700 font-semibold truncate">{area.title}</span>
        </div>
      </nav>

      {/* Hero */}
      <section
        className={`${area.bgColor} relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-2 ${area.borderColor}`}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div
            className={`inline-block p-4 rounded-2xl bg-gradient-to-br ${area.color} text-white mb-6 shadow-xl`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14">{area.icon}</div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {area.title}
          </h1>
          <p className={`text-lg sm:text-xl lg:text-2xl font-semibold ${area.accentText} mb-4 sm:mb-6`}>
            {area.tagline}
          </p>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            {area.longDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href="#chat"
              className={`w-full sm:w-auto bg-gradient-to-r ${area.color} hover:opacity-90 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg uppercase tracking-wide text-center`}
            >
              Ask Richard AI
            </a>
            <Link
              href="/#membership"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-extrabold px-8 py-4 rounded-xl shadow-lg border-4 border-gray-900 transition-all duration-300 transform hover:scale-105 text-base sm:text-lg uppercase tracking-wide text-center"
            >
              Join GPULaw
            </Link>
          </div>
        </div>
      </section>

      {/* Topics we help with */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              How GPULaw Helps with {area.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Start with instant AI guidance on any of these topics, then escalate to a licensed
              attorney when your situation needs human expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {area.topics.map((topic) => (
              <div
                key={topic.title}
                className={`${area.bgColor} ${area.borderColor} border-2 rounded-xl p-6 shadow-md hover:shadow-xl transition-all`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-br ${area.color} flex items-center justify-center text-white`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                    {topic.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat preloaded with this category */}
      <AIChat
        initialCategory={area.title}
        initialQuestions={area.questions}
        initialGreeting={initialGreeting}
      />

      {/* Pricing */}
      <Pricing />

      {/* Case intake form */}
      <CaseIntakeFormSection />

      {/* Related practice areas */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Explore Other Practice Areas
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              GPULaw members get AI guidance and attorney access across every area we cover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedAreas.map((other) => (
              <Link
                key={other.slug}
                href={`/${other.slug}`}
                className={`${other.bgColor} ${other.borderColor} border-2 rounded-xl p-6 shadow-md hover:shadow-xl transition-all block group`}
              >
                <div
                  className={`inline-block p-3 rounded-lg bg-gradient-to-br ${other.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  <div className="w-8 h-8">{other.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{other.title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{other.shortDescription}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/#practice-areas"
              className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              See All Practice Areas
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
