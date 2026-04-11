import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { requireUser } from '@/lib/authUser';
import { db } from '@/lib/db';
import { cases } from '@/lib/schema';

export const metadata = {
  title: 'My Cases | Dashboard | GPULaw',
};

const statusStyles: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  in_review: 'bg-amber-100 text-amber-800 border-amber-200',
  attorney_assigned: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const urgencyStyles: Record<string, string> = {
  low: 'text-green-700',
  medium: 'text-yellow-700',
  high: 'text-orange-700',
  critical: 'text-red-700',
};

function formatStatus(status: string) {
  return status.replace(/_/g, ' ');
}

export default async function DashboardCasesPage() {
  const user = await requireUser();

  const userCases = await db
    .select()
    .from(cases)
    .where(eq(cases.userId, user.id))
    .orderBy(desc(cases.createdAt));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            My Cases
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Every case you submit through GPULaw is saved here with its AI analysis.
          </p>
        </div>
        <Link
          href="/dashboard/cases/new"
          className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-bold px-5 py-2.5 rounded-xl shadow text-sm text-center"
        >
          + Submit a new case
        </Link>
      </div>

      {userCases.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No cases yet</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-5">
            Use the intake form on the home page to submit your first legal matter. Richard AI will analyze it
            and your case will show up here.
          </p>
          <Link
            href="/dashboard/cases/new"
            className="inline-block bg-blue-900 hover:bg-blue-950 text-white font-bold px-6 py-3 rounded-xl shadow"
          >
            Submit a case
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userCases.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/cases/${c.id}`}
              className="block bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h2 className="text-lg font-bold text-gray-900 truncate">
                      {c.category}
                    </h2>
                    <span
                      className={`inline-flex items-center text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusStyles[c.status] ?? statusStyles.new}`}
                    >
                      {formatStatus(c.status)}
                    </span>
                    {c.needsAttorney && (
                      <span className="inline-flex items-center text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                        Attorney recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p
                    className={`text-xs font-bold uppercase tracking-wide ${urgencyStyles[c.urgency] ?? ''}`}
                  >
                    {c.urgency} urgency
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
