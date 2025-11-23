export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e40af' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-amber-600 mb-4">
              GPULaw
            </h1>
            <div className="flex items-center justify-center gap-3 text-lg sm:text-xl text-gray-700 font-semibold">
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
                AI-Powered
              </span>
              <span className="text-gray-400">+</span>
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Attorney Access
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Legal Protection Powered by AI,
            <br />
            <span className="text-blue-700">Backed by Human Attorneys</span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium mb-3 sm:mb-4 max-w-4xl mx-auto px-2">
            Affordable legal membership combining advanced AI tools with experienced lawyers
          </p>

          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto px-2">
            From everyday legal questions to complex cases — get instant AI guidance, document preparation, and attorney consultation when you need it.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12 px-4">
            <a
              href="#membership"
              className="w-full sm:w-auto bg-blue-900 hover:bg-blue-950 text-white font-extrabold px-8 sm:px-12 py-4 sm:py-5 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-blue-700 text-base sm:text-lg tracking-wide uppercase text-center"
            >
              Join GPULaw Today
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-extrabold px-8 sm:px-12 py-4 sm:py-5 rounded-xl shadow-xl border-4 border-gray-900 transition-all duration-300 transform hover:scale-105 text-base sm:text-lg tracking-wide uppercase text-center"
            >
              How It Works
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border-2 border-blue-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-700">AI Legal Assistance</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border-2 border-amber-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-700 mb-1 sm:mb-2">Licensed</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-700">Attorneys On-Demand</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border-2 border-green-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-1 sm:mb-2">6+</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-700">Legal Practice Areas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
