'use client';

import { useState } from 'react';

export default function PayPalSetup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createPlans = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/paypal/create-plans', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to create plans');
      }
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PayPal Subscription Plans Setup
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Click the button below to automatically create all three subscription plans
            (Basic, Professional, Premium) in your PayPal account.
          </p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-3">Before You Start:</h2>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>PayPal credentials are configured in .env.local</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Using <strong>{process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX'}</strong> environment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⚠️</span>
                <span>This will create products and billing plans in PayPal</span>
              </li>
            </ul>
          </div>

          <button
            onClick={createPlans}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90 transform hover:scale-105 shadow-lg'
            }`}
          >
            {loading ? 'Creating Plans...' : 'Create PayPal Subscription Plans'}
          </button>

          {error && (
            <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-green-900 mb-4">
                ✓ Plans Created Successfully!
              </h3>
              <p className="text-green-800 mb-4">
                Environment: <strong>{result.environment}</strong>
              </p>

              <div className="bg-white rounded-lg p-4 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Created Plans:</h4>
                <div className="space-y-4">
                  {result.plans.map((plan: any, index: number) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <p className="font-semibold text-gray-900">{plan.planName}</p>
                      <p className="text-sm text-gray-600">Plan ID: {plan.planId}</p>
                      <p className="text-sm text-gray-600">Product ID: {plan.productId}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <h4 className="font-bold text-white mb-3">
                  Add these to your .env.local file:
                </h4>
                <pre className="text-green-400 text-sm font-mono">
                  {Object.entries(result.envVariables)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('\n')}
                </pre>
              </div>

              <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> Copy the environment variables above and add them
                  to your .env.local file, then restart your development server.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Details:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-2">Basic</h4>
                <p className="text-2xl font-bold text-gray-600">$9/month</p>
                <p className="text-sm text-gray-600 mt-2">
                  Essential AI legal tools for everyday needs
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                <h4 className="font-bold text-blue-900 mb-2">Professional</h4>
                <p className="text-2xl font-bold text-blue-600">$29/month</p>
                <p className="text-sm text-blue-600 mt-2">
                  AI assistance plus limited attorney access
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <h4 className="font-bold text-amber-900 mb-2">Premium</h4>
                <p className="text-2xl font-bold text-amber-600">$299/month</p>
                <p className="text-sm text-amber-600 mt-2">
                  Full AI + attorney protection for peace of mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
