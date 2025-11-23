'use client';

import { useState, useEffect } from 'react';

interface Plan {
  id: string;
  name: string;
  productId: string;
  status: string;
  price: string;
  frequency: string;
  created: string;
}

export default function ListPayPalPlans() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [environment, setEnvironment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paypal/list-plans');
      const data = await response.json();

      if (data.success) {
        setPlans(data.plans);
        setEnvironment(data.environment);
      } else {
        setError(data.error || 'Failed to fetch plans');
      }
    } catch (err) {
      setError(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-900">
              PayPal Subscription Plans
            </h1>
            <button
              onClick={fetchPlans}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-blue-900">
              <strong>Environment:</strong>{' '}
              <span className="font-mono uppercase">{environment || 'Loading...'}</span>
            </p>
            <p className="text-blue-800 text-sm mt-2">
              {plans.length} plan(s) found in your PayPal account
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <h3 className="text-xl font-bold text-red-900 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-xl text-gray-600 mb-4">No plans found</p>
              <p className="text-gray-500 mb-6">
                Create subscription plans to get started
              </p>
              <a
                href="/setup/paypal"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Plans
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {index + 1}. {plan.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            <strong>Plan ID:</strong>{' '}
                            <button
                              onClick={() => copyToClipboard(plan.id)}
                              className="font-mono text-blue-600 hover:text-blue-800 hover:underline"
                              title="Click to copy"
                            >
                              {plan.id}
                            </button>
                          </p>
                          <p className="text-gray-600">
                            <strong>Product ID:</strong>{' '}
                            <span className="font-mono">{plan.productId}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <strong>Status:</strong>{' '}
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                plan.status === 'ACTIVE'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {plan.status}
                            </span>
                          </p>
                          <p className="text-gray-600">
                            <strong>Price:</strong> {plan.price}/{plan.frequency}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            <strong>Created:</strong>{' '}
                            {new Date(plan.created).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8 bg-gray-900 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Environment Variables
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Add these to your .env.local file:
                </p>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-green-400">
                  {plans
                    .filter((p) =>
                      p.name.toLowerCase().includes('gpulaw') ||
                      p.name.toLowerCase().includes('basic') ||
                      p.name.toLowerCase().includes('professional') ||
                      p.name.toLowerCase().includes('premium')
                    )
                    .map((plan) => {
                      const name = plan.name.toLowerCase();
                      let envKey = '';

                      if (name.includes('basic')) {
                        envKey = 'NEXT_PUBLIC_PAYPAL_PLAN_ID_BASIC';
                      } else if (name.includes('professional')) {
                        envKey = 'NEXT_PUBLIC_PAYPAL_PLAN_ID_PROFESSIONAL';
                      } else if (name.includes('premium')) {
                        envKey = 'NEXT_PUBLIC_PAYPAL_PLAN_ID_PREMIUM';
                      }

                      if (envKey) {
                        return (
                          <div key={plan.id} className="mb-1">
                            {envKey}={plan.id}
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
