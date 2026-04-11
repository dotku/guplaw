import Link from 'next/link';
import CaseIntakeForm from '@/components/CaseIntakeForm';
import { requireUser } from '@/lib/authUser';

export const metadata = {
  title: 'Submit a Case | Dashboard | GPULaw',
};

const VALID_CATEGORIES = [
  'Family Law',
  'Consumer & Debt',
  'Housing & Landlord-Tenant',
  'Wills, Estates & Probate',
  'Immigration',
  'Crypto Compliance',
  'Other',
];

export default async function NewCasePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const user = await requireUser();
  const { category } = await searchParams;
  const initialCategory =
    category && VALID_CATEGORIES.includes(category) ? category : '';

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/dashboard/cases"
          className="text-sm text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to all cases
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          Submit a new case
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Describe your legal issue. Richard AI will analyze it and save it to your dashboard, where you can
          review the analysis and escalate to an attorney if needed.
        </p>
      </div>

      <div className="max-w-2xl">
        <CaseIntakeForm
          initialName={user.name ?? ''}
          initialEmail={user.email ?? ''}
          initialCategory={initialCategory}
          redirectOnSuccess="/dashboard/cases"
        />
      </div>
    </div>
  );
}
