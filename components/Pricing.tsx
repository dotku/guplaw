'use client';

import PayPalSubscriptionButton from './PayPalSubscriptionButton';

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      period: "",
      description: "Pure AI-powered legal assistance",
      features: [
        "Unlimited AI legal consultations",
        "Basic document generation",
        "Legal issue triage",
        "6 practice area coverage",
        "Legal knowledge base access",
        "Limited email support",
      ],
      notIncluded: [
        "Attorney consultations",
        "Document review by attorney",
        "Court representation",
      ],
      buttonText: "Start Basic",
      popular: false,
      color: "from-gray-600 to-gray-800",
      borderColor: "border-gray-200",
      paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_BASIC || '',
      paypalButtonColor: 'silver' as const,
    },
    {
      name: "Professional",
      price: "$59.99",
      period: "/month",
      description: "AI + Attorney combined support",
      features: [
        "Everything in Basic, plus:",
        "2 attorney consultations/month (30 min each)",
        "Attorney document review (up to 5 pages)",
        "Advanced AI document generation",
        "Priority email & chat support",
        "Discount on additional attorney hours",
      ],
      notIncluded: [
        "Unlimited attorney consultations",
        "Court representation",
      ],
      buttonText: "Get Professional",
      popular: true,
      color: "from-blue-600 to-blue-800",
      borderColor: "border-blue-300",
      paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PROFESSIONAL || '',
      paypalButtonColor: 'blue' as const,
    },
    {
      name: "Attorney Elite",
      price: "$899.99",
      period: "/month",
      description: "AI-powered platform for law firms and attorney offices",
      features: [
        "Complete AI integration for your law practice",
        "Intelligent case indexing & search system",
        "AI-assisted legal document drafting",
        "Advanced legal research powered by AI",
        "Case management & organization tools",
        "Custom training & onboarding for your team",
        "Dedicated integration & technical support",
        "API access for your existing systems",
      ],
      notIncluded: [],
      buttonText: "Get Attorney Elite",
      popular: false,
      color: "from-amber-600 to-amber-800",
      borderColor: "border-amber-300",
      paypalPlanId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PREMIUM || '',
      paypalButtonColor: 'gold' as const,
    },
  ];

  return (
    <section id="membership" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Choose Your Protection Level
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            From AI-only assistance to comprehensive attorney coverage — find the plan that fits your needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-xl ${
                plan.popular ? 'border-4 ' + plan.borderColor + ' transform scale-105' : 'border-2 ' + plan.borderColor
              } overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-bl-xl font-bold text-sm shadow-lg">
                    ⭐ MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2 text-sm sm:text-base">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 sm:mb-8 flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span className={`text-gray-700 ${feature.includes('Everything') ? 'font-semibold' : ''}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 opacity-50">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-400 line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                {plan.price === "Free" ? (
                  <a
                    href="#chat"
                    className={`w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg text-base sm:text-lg text-center block`}
                  >
                    {plan.buttonText}
                  </a>
                ) : (
                  <PayPalSubscriptionButton
                    planId={plan.paypalPlanId}
                    buttonText={plan.buttonText}
                    planName={plan.name}
                    color={plan.paypalButtonColor}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Money-Back Guarantee */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">✓</div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">30-Day Money-Back Guarantee</h3>
            <p className="text-base sm:text-lg lg:text-xl text-green-100 mb-4 sm:mb-6">
              Try GPULaw risk-free. If you're not completely satisfied within the first 30 days,
              we'll refund your membership — no questions asked.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>No Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Full Refund</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10 px-2">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border-2 border-gray-200">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Can I upgrade or downgrade my plan?</h4>
              <p className="text-sm sm:text-base text-gray-600">Yes! You can change your membership level at any time. Upgrades take effect immediately, and downgrades apply at your next billing cycle.</p>
            </div>
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border-2 border-gray-200">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Are attorneys licensed in my state?</h4>
              <p className="text-sm sm:text-base text-gray-600">Yes, we connect you with attorneys licensed in your jurisdiction who are experienced in the relevant practice area.</p>
            </div>
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border-2 border-gray-200">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">What if I need more attorney time?</h4>
              <p className="text-sm sm:text-base text-gray-600">Members receive discounted hourly rates for additional attorney consultations beyond their plan limits.</p>
            </div>
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border-2 border-gray-200">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Is my information confidential?</h4>
              <p className="text-sm sm:text-base text-gray-600">Absolutely. All communications are protected by attorney-client privilege and our strict privacy policies.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
