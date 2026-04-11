import { desc, eq } from 'drizzle-orm';
import DashboardChat from '@/components/DashboardChat';
import { requireUser } from '@/lib/authUser';
import { db } from '@/lib/db';
import { conversations } from '@/lib/schema';

export const metadata = {
  title: 'Chat with Richard | Dashboard | GPULaw',
};

export default async function DashboardChatPage() {
  const user = await requireUser();

  const convs = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .where(eq(conversations.userId, user.id))
    .orderBy(desc(conversations.updatedAt));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          Chat with Richard
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Your private AI legal assistant. Conversations are saved so you can pick up where you left off.
        </p>
      </div>

      <DashboardChat
        initialConversations={convs.map((c) => ({
          id: c.id,
          title: c.title,
          updatedAt: c.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
