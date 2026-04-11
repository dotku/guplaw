'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnalysisResult {
  analysis: string;
  needsAttorney: boolean;
  category: string;
  urgency: string;
  caseId?: string | null;
}

interface CaseIntakeFormProps {
  /** Prefill the name field (e.g., from the logged-in user). */
  initialName?: string;
  /** Prefill the email field. */
  initialEmail?: string;
  /** Prefill the phone field. */
  initialPhone?: string;
  /** Preselect the legal category. */
  initialCategory?: string;
  /**
   * If set, on successful submission with a persisted caseId, the user is
   * redirected to `${redirectOnSuccess}/${caseId}`. Typically
   * `/dashboard/cases`.
   */
  redirectOnSuccess?: string;
}

const CATEGORIES = [
  'Family Law',
  'Consumer & Debt',
  'Housing & Landlord-Tenant',
  'Wills, Estates & Probate',
  'Immigration',
  'Crypto Compliance',
  'Other',
];

const URGENCY_LEVELS = [
  { value: 'low', label: 'Low - General question' },
  { value: 'medium', label: 'Medium - Need help within a week' },
  { value: 'high', label: 'High - Urgent matter' },
  { value: 'critical', label: 'Critical - Immediate assistance needed' },
];

export default function CaseIntakeForm({
  initialName = '',
  initialEmail = '',
  initialPhone = '',
  initialCategory = '',
  redirectOnSuccess,
}: CaseIntakeFormProps = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    category: initialCategory,
    urgency: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.error || 'Failed to analyze case');
      }

      const result: AnalysisResult = await response.json();

      if (redirectOnSuccess && result.caseId) {
        router.push(`${redirectOnSuccess}/${result.caseId}`);
        router.refresh();
        return;
      }

      setAnalysisResult(result);
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'An error occurred while analyzing your case. Please try again.';
      setError(message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setAnalysisResult(null);
    setError(null);
    setFormData({
      name: initialName,
      email: initialEmail,
      phone: initialPhone,
      category: initialCategory,
      urgency: '',
      description: '',
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border-2 border-blue-100">
      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl animate-pulse">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Analyzing Your Case...</h3>
          <p className="text-base sm:text-lg text-gray-600">
            Richard AI legal assistant is reviewing your legal issue and preparing comprehensive guidance.
          </p>
        </div>
      ) : submitted && analysisResult ? (
        <div className="space-y-6">
          <div className="text-center pb-6 border-b-2 border-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h3>
            <p className="text-sm text-gray-600">
              Case Category: <span className="font-semibold">{analysisResult.category}</span> |
              Urgency: <span className="font-semibold capitalize">{analysisResult.urgency}</span>
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 max-h-96 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900">AI Legal Analysis</h4>
            </div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisResult.analysis}
              </ReactMarkdown>
            </div>
          </div>

          {analysisResult.needsAttorney && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <svg className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Attorney Consultation Recommended</h4>
                  <p className="text-gray-700 mb-3">
                    Based on the urgency and complexity of your case, we recommend connecting with a licensed attorney for personalized legal advice.
                  </p>
                  <button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all">
                    Connect with Attorney
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all"
            >
              Submit Another Case
            </button>
            <a
              href="#chat"
              className="flex-1 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition-all text-center"
            >
              Chat with AI
            </a>
          </div>

          {analysisResult.caseId && (
            <p className="text-xs text-gray-500 text-center">
              This case has been saved to your dashboard.{' '}
              <a
                href={`/dashboard/cases/${analysisResult.caseId}`}
                className="text-blue-700 font-semibold underline"
              >
                View in dashboard
              </a>
            </p>
          )}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Error</h3>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => setError(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Case Intake Form</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">All fields are required for best AI analysis</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
              Legal Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="urgency" className="block text-sm font-semibold text-gray-900 mb-2">
              Urgency Level
            </label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="">Select urgency level</option>
              {URGENCY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Describe Your Legal Issue
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Please provide as much detail as possible about your situation..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Be specific: Include dates, parties involved, documents you have, and what outcome you&apos;re seeking
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-extrabold px-6 sm:px-10 py-4 sm:py-5 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-blue-700 text-base sm:text-lg tracking-wide uppercase"
          >
            {redirectOnSuccess ? 'Save Case & Get Analysis' : 'Get AI Analysis Now'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By submitting, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      )}
    </div>
  );
}
