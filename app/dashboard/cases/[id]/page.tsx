import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { requireUser } from '@/lib/authUser';
import { db } from '@/lib/db';
import { cases } from '@/lib/schema';

export const metadata = {
  title: 'Case detail | Dashboard | GPULaw',
};

const statusStyles: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  in_review: 'bg-amber-100 text-amber-800 border-amber-200',
  attorney_assigned: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const [c] = await db
    .select()
    .from(cases)
    .where(and(eq(cases.id, id), eq(cases.userId, user.id)))
    .limit(1);

  if (!c) notFound();

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

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {c.category}
            </h1>
            <span
              className={`inline-flex items-center text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${statusStyles[c.status] ?? statusStyles.new}`}
            >
              {c.status.replace(/_/g, ' ')}
            </span>
            {c.needsAttorney && (
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                Attorney recommended
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div>
              <span className="font-semibold text-gray-800">Submitted:</span>{' '}
              {new Date(c.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold text-gray-800">Urgency:</span>{' '}
              <span className="uppercase">{c.urgency}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Client:</span>{' '}
              {c.clientName}
            </div>
            {c.clientEmail && (
              <div>
                <span className="font-semibold text-gray-800">Email:</span>{' '}
                {c.clientEmail}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Case description</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {c.description}
          </p>
        </div>

        {c.analysis && (
          <div className="p-6 sm:p-8 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Richard AI analysis</h2>
            <div className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
