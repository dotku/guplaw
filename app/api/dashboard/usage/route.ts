import { NextRequest, NextResponse } from 'next/server';
import { sql, gte, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/authUser';
import { db } from '@/lib/db';
import { aiUsageLogs, users } from '@/lib/schema';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const days = Math.min(Number(searchParams.get('days') || '30'), 90);
  const since = new Date();
  since.setDate(since.getDate() - days);

  // Daily aggregates (platform-wide)
  const dailyStats = await db
    .select({
      date: sql<string>`date(${aiUsageLogs.createdAt} AT TIME ZONE 'UTC')`.as('date'),
      requests: sql<number>`count(*)::int`.as('requests'),
      totalTokens: sql<number>`coalesce(sum(${aiUsageLogs.totalTokens}), 0)::int`.as('total_tokens'),
      promptTokens: sql<number>`coalesce(sum(${aiUsageLogs.promptTokens}), 0)::int`.as('prompt_tokens'),
      completionTokens: sql<number>`coalesce(sum(${aiUsageLogs.completionTokens}), 0)::int`.as('completion_tokens'),
      totalCost: sql<string>`coalesce(sum(${aiUsageLogs.cost}), 0)`.as('total_cost'),
      avgDuration: sql<number>`round(avg(${aiUsageLogs.durationMs}))::int`.as('avg_duration'),
      errorCount: sql<number>`count(*) filter (where not ${aiUsageLogs.success})::int`.as('error_count'),
      uniqueUsers: sql<number>`count(distinct ${aiUsageLogs.userId})::int`.as('unique_users'),
    })
    .from(aiUsageLogs)
    .where(gte(aiUsageLogs.createdAt, since))
    .groupBy(sql`date(${aiUsageLogs.createdAt} AT TIME ZONE 'UTC')`)
    .orderBy(sql`date(${aiUsageLogs.createdAt} AT TIME ZONE 'UTC')`);

  // Per-model breakdown
  const modelStats = await db
    .select({
      model: aiUsageLogs.model,
      requests: sql<number>`count(*)::int`.as('requests'),
      totalTokens: sql<number>`coalesce(sum(${aiUsageLogs.totalTokens}), 0)::int`.as('total_tokens'),
      totalCost: sql<string>`coalesce(sum(${aiUsageLogs.cost}), 0)`.as('total_cost'),
    })
    .from(aiUsageLogs)
    .where(gte(aiUsageLogs.createdAt, since))
    .groupBy(aiUsageLogs.model)
    .orderBy(desc(sql`count(*)`));

  // Per-endpoint breakdown
  const endpointStats = await db
    .select({
      endpoint: aiUsageLogs.endpoint,
      requests: sql<number>`count(*)::int`.as('requests'),
      totalTokens: sql<number>`coalesce(sum(${aiUsageLogs.totalTokens}), 0)::int`.as('total_tokens'),
      totalCost: sql<string>`coalesce(sum(${aiUsageLogs.cost}), 0)`.as('total_cost'),
      avgDuration: sql<number>`round(avg(${aiUsageLogs.durationMs}))::int`.as('avg_duration'),
    })
    .from(aiUsageLogs)
    .where(gte(aiUsageLogs.createdAt, since))
    .groupBy(aiUsageLogs.endpoint)
    .orderBy(desc(sql`count(*)`));

  // Top users by request count
  const topUsers = await db
    .select({
      userId: aiUsageLogs.userId,
      userName: users.name,
      userEmail: users.email,
      requests: sql<number>`count(*)::int`.as('requests'),
      totalTokens: sql<number>`coalesce(sum(${aiUsageLogs.totalTokens}), 0)::int`.as('total_tokens'),
      totalCost: sql<string>`coalesce(sum(${aiUsageLogs.cost}), 0)`.as('total_cost'),
    })
    .from(aiUsageLogs)
    .leftJoin(users, sql`${aiUsageLogs.userId} = ${users.id}`)
    .where(gte(aiUsageLogs.createdAt, since))
    .groupBy(aiUsageLogs.userId, users.name, users.email)
    .orderBy(desc(sql`count(*)`))
    .limit(20);

  // Platform totals
  const [totals] = await db
    .select({
      requests: sql<number>`count(*)::int`.as('requests'),
      totalTokens: sql<number>`coalesce(sum(${aiUsageLogs.totalTokens}), 0)::int`.as('total_tokens'),
      totalCost: sql<string>`coalesce(sum(${aiUsageLogs.cost}), 0)`.as('total_cost'),
      errorCount: sql<number>`count(*) filter (where not ${aiUsageLogs.success})::int`.as('error_count'),
      uniqueUsers: sql<number>`count(distinct ${aiUsageLogs.userId})::int`.as('unique_users'),
    })
    .from(aiUsageLogs)
    .where(gte(aiUsageLogs.createdAt, since));

  // Today's platform stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [today] = await db
    .select({
      requests: sql<number>`count(*)::int`.as('requests'),
      totalTokens: sql<number>`coalesce(sum(${aiUsageLogs.totalTokens}), 0)::int`.as('total_tokens'),
      totalCost: sql<string>`coalesce(sum(${aiUsageLogs.cost}), 0)`.as('total_cost'),
      uniqueUsers: sql<number>`count(distinct ${aiUsageLogs.userId})::int`.as('unique_users'),
    })
    .from(aiUsageLogs)
    .where(gte(aiUsageLogs.createdAt, todayStart));

  // Total registered users on the platform
  const [userCount] = await db
    .select({ count: sql<number>`count(*)::int`.as('count') })
    .from(users);

  return NextResponse.json({
    days,
    today,
    totals,
    totalRegisteredUsers: userCount.count,
    daily: dailyStats,
    byModel: modelStats,
    byEndpoint: endpointStats,
    topUsers,
  });
}
