import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/authUser';
import { db } from '@/lib/db';
import { conversations } from '@/lib/schema';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .where(eq(conversations.userId, user.id))
    .orderBy(desc(conversations.updatedAt));

  return NextResponse.json({ conversations: rows });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const title: string =
    typeof body?.title === 'string' && body.title.trim().length > 0
      ? body.title.trim().slice(0, 255)
      : 'New conversation';

  const [created] = await db
    .insert(conversations)
    .values({ userId: user.id, title })
    .returning();

  return NextResponse.json({ conversation: created });
}
