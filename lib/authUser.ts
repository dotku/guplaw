import { redirect } from 'next/navigation';
import { auth0 } from './auth0';
import { db } from './db';
import { users, type User } from './schema';

/**
 * Look up the DB user for the current Auth0 session, creating one on first login.
 * Uses an atomic upsert so concurrent calls (e.g., layout + page rendering in
 * parallel) cannot race on the unique auth0_sub constraint.
 * Returns null when not signed in.
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth0.getSession();
  if (!session?.user?.sub) return null;

  const auth0Sub = session.user.sub;
  const email = session.user.email ?? null;
  const name = session.user.name ?? null;

  const [user] = await db
    .insert(users)
    .values({ auth0Sub, email, name })
    .onConflictDoUpdate({
      target: users.auth0Sub,
      set: { email, name, updatedAt: new Date() },
    })
    .returning();

  return user;
}

/**
 * Server-side guard for dashboard pages.
 * Redirects to Auth0 login when not authenticated.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}
