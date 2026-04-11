import Link from 'next/link';
import { count, eq } from 'drizzle-orm';
import { requireUser } from '@/lib/authUser';
import { db } from '@/lib/db';
import { cases, conversations } from '@/lib/schema';

export const metadata = {
  title: 'Dashboard | GPULaw',
};

export default async function DashboardPage() {
  const user = await requireUser();

  const [convCount] = await db
    .select({ value: count() })
    .from(conversations)
    .where(eq(conversations.userId, user.id));

  const [caseCount] = await db
    .select({ value: count() })
    .from(cases)
    .where(eq(cases.userId, user.id));

  const cards = [
    {
      href: '/dashboard/chat',
      title: 'Chat with Richard AI',
      description:
        'Ask legal questions across all six practice areas. Your conversations are saved so you can come back any time.',
      color: 'from-blue-600 to-blue-800',
      stat: `${convCount?.value ?? 0} saved conversation${(convCount?.value ?? 0) === 1 ? '' : 's'}`,
      cta: convCount?.value ? 'Continue chatting' : 'Start a new chat',
    },
    {
      href: caseCount?.value ? '/dashboard/cases' : '/dashboard/cases/new',
      title: 'My Cases',
      description:
        'Review the cases you have submitted, see the AI analysis, and track attorney escalation.',
      color: 'from-emerald-600 to-green-700',
      stat: `${caseCount?.value ?? 0} case${(caseCount?.value ?? 0) === 1 ? '' : 's'} on file`,
      cta: caseCount?.value ? 'View cases' : 'Submit a case',
    },
    {
      href: process.env.NEXT_PUBLIC_MARKETPLACE_URL || '/#practice-areas',
      title: 'Find an Attorney',
      description:
        'Browse licensed attorneys across practice areas in the GPULaw marketplace.',
      color: 'from-amber-600 to-orange-600',
      stat: 'Marketplace',
      cta: 'Browse attorneys',
      external: true,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Your private legal workspace — chat with Richard, manage your cases, and connect with attorneys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Wrapper = card.external ? 'a' : Link;
          const wrapperProps = card.external
            ? { href: card.href, target: '_blank', rel: 'noopener noreferrer' }
            : { href: card.href };

          return (
            <Wrapper
              key={card.title}
              {...(wrapperProps as { href: string })}
              className="group bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`} />
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">
                  {card.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {card.stat}
                  </span>
                  <span className="text-sm font-bold text-blue-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {card.cta}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
