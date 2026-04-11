import Link from 'next/link';
import { practiceAreas } from '@/lib/practiceAreas';

export default function LegalCategories() {
  return (
    <section id="practice-areas" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Complete Legal Coverage
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            AI-powered assistance and attorney access across 6 essential practice areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {practiceAreas.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className={`${category.bgColor} ${category.borderColor} border-2 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group block`}
            >
              <div className={`inline-block p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br ${category.color} text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                  {category.icon}
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                {category.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {category.shortDescription}
              </p>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                    </svg>
                    <span className="font-semibold">AI Guidance</span>
                  </div>
                  <span className="text-gray-400">+</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-semibold">Attorney</span>
                  </div>
                </div>
                <span className="text-blue-700 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Learn more
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* AI + Attorney Advantage */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-white shadow-2xl">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              The GPULaw Advantage
            </h3>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-blue-100">
              Every practice area comes with instant AI assistance for quick answers and document preparation,
              plus the ability to escalate to a licensed attorney when you need human expertise.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border-2 border-white/20">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⚡</div>
                <h4 className="text-lg sm:text-xl font-bold mb-2">Instant AI Responses</h4>
                <p className="text-sm sm:text-base text-blue-100">Get immediate answers to legal questions 24/7</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border-2 border-white/20">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">👨‍⚖️</div>
                <h4 className="text-lg sm:text-xl font-bold mb-2">Attorney Consultations</h4>
                <p className="text-sm sm:text-base text-blue-100">Connect with licensed lawyers for complex matters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
