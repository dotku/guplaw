'use client';

export default function LegalCategories() {
  const categories = [
    {
      title: "Family Law",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
        </svg>
      ),
      description: "Divorce, child custody, child support, alimony, adoption, and domestic violence protection",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      questions: [
        "How do I file for divorce?",
        "What factors determine child custody?",
        "How is child support calculated?",
        "What are my rights in a domestic violence case?",
        "What documents do I need for adoption?",
      ],
    },
    {
      title: "Consumer & Debt",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
        </svg>
      ),
      description: "Credit card debt collection, car repossession, payday loans, bankruptcy, credit reporting errors, and identity theft",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      questions: [
        "How can I dispute a credit card debt?",
        "What are my rights against debt collectors?",
        "How does bankruptcy work?",
        "Can I stop a car repossession?",
        "How do I fix credit reporting errors?",
      ],
    },
    {
      title: "Housing & Landlord-Tenant",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
      ),
      description: "Evictions, rent increases, security deposit disputes, unsafe housing conditions",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      questions: [
        "What are my rights as a tenant?",
        "How can I fight an eviction?",
        "Can my landlord raise my rent?",
        "How do I get my security deposit back?",
        "What can I do about unsafe housing?",
      ],
    },
    {
      title: "Wills, Estates & Probate",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
        </svg>
      ),
      description: "Writing wills, setting up trusts, power of attorney, and estate administration after death",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      questions: [
        "What documents do I need for a will?",
        "How do I set up a trust?",
        "What is power of attorney?",
        "How does the probate process work?",
        "How do I become an executor of an estate?",
      ],
    },
    {
      title: "Immigration",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
        </svg>
      ),
      description: "Green card applications, asylum, citizenship (naturalization), deportation defense, and work visas",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      questions: [
        "How do I apply for a green card?",
        "What is the asylum process?",
        "How can I become a U.S. citizen?",
        "What can I do if facing deportation?",
        "How do I get a work visa?",
      ],
    },
    {
      title: "Traffic Cases",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
        </svg>
      ),
      description: "Parking and traffic tickets, DUIs",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      questions: [
        "How do I fight a traffic ticket?",
        "What are the penalties for a DUI?",
        "Can I contest a parking ticket?",
        "Will a ticket affect my insurance?",
        "How can I get points removed from my license?",
      ],
    },
  ];

  const handleCategoryClick = (category: typeof categories[0]) => {
    // Store selected category in sessionStorage
    sessionStorage.setItem('selectedCategory', JSON.stringify({
      title: category.title,
      questions: category.questions,
    }));

    // Dispatch custom event to notify AIChat component
    window.dispatchEvent(new CustomEvent('categorySelected'));

    // Scroll to chat section
    const chatSection = document.getElementById('chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category)}
              className={`${category.bgColor} ${category.borderColor} border-2 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group`}
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
                {category.description}
              </p>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-gray-200">
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
              </div>
            </div>
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
