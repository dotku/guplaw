import CaseIntakeForm from './CaseIntakeForm';
import { getCurrentUser } from '@/lib/authUser';

/**
 * Server wrapper for the marketing-page case intake. Fetches the current user
 * (if any) so the form can be prefilled and so logged-in submissions redirect
 * into the dashboard.
 */
export default async function CaseIntakeFormSection() {
  let user: Awaited<ReturnType<typeof getCurrentUser>> | null = null;
  try {
    user = await getCurrentUser();
  } catch (err) {
    // Re-throw Next.js internal signals (e.g., DYNAMIC_SERVER_USAGE,
    // NEXT_REDIRECT, NEXT_NOT_FOUND) so the framework can handle them.
    if (err && typeof err === 'object' && 'digest' in err) {
      throw err;
    }
    // Don't block the public home page if the DB is unreachable.
    console.error('[CaseIntakeFormSection] getCurrentUser failed:', err);
  }

  return (
    <section id="get-help" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Info */}
          <div>
            <div className="lg:sticky lg:top-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Get AI-Powered Legal Help Now
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
                Describe your legal issue and receive instant AI analysis, guidance, and next steps.
                If needed, connect with a licensed attorney.
              </p>

              {/* Process Steps */}
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Submit Your Issue</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Tell us about your legal situation in your own words</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">AI Analysis</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Our AI instantly analyzes your case and provides insights</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Get Guidance</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Receive actionable legal guidance and document templates</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg text-sm sm:text-base">
                    4
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Connect with Attorney</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">If needed, get matched with a licensed attorney</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <h4 className="font-bold text-gray-900">100% Confidential</h4>
                </div>
                <p className="text-gray-700 text-sm">
                  All information is protected by attorney-client privilege and encrypted for your security.
                </p>
              </div>

              {user && (
                <p className="mt-6 text-sm text-gray-600">
                  Signed in as{' '}
                  <span className="font-semibold text-gray-900">
                    {user.name || user.email}
                  </span>
                  . Submissions are saved to{' '}
                  <a href="/dashboard/cases" className="text-blue-700 font-semibold underline">
                    your dashboard
                  </a>
                  .
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Form */}
          <CaseIntakeForm
            initialName={user?.name ?? ''}
            initialEmail={user?.email ?? ''}
            redirectOnSuccess={user ? '/dashboard/cases' : undefined}
          />
        </div>
      </div>
    </section>
  );
}
