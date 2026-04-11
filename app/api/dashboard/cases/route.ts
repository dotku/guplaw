import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/authUser';
import { db } from '@/lib/db';
import { cases } from '@/lib/schema';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(cases)
    .where(eq(cases.userId, user.id))
    .orderBy(desc(cases.createdAt));

  return NextResponse.json({ cases: rows });
}
