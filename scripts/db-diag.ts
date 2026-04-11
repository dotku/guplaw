import { config } from 'dotenv';
config({ path: '.env.local' });

async function main() {
  const { db } = await import('../lib/db');
  const { users } = await import('../lib/schema');
  const { like } = await import('drizzle-orm');

  console.log('-- Cleaning up old diag rows --');
  const deleted = await db
    .delete(users)
    .where(like(users.auth0Sub, 'diag|%'))
    .returning({ id: users.id });
  console.log(`Deleted ${deleted.length} diag rows`);

  console.log('\n-- Testing upsert (first call, should INSERT) --');
  const sub = 'diag|upsert-test';
  const [first] = await db
    .insert(users)
    .values({ auth0Sub: sub, email: 'a@example.com', name: 'First' })
    .onConflictDoUpdate({
      target: users.auth0Sub,
      set: { email: 'a@example.com', name: 'First', updatedAt: new Date() },
    })
    .returning();
  console.log('First call:', first);

  console.log('\n-- Testing upsert (second call, should UPDATE) --');
  const [second] = await db
    .insert(users)
    .values({ auth0Sub: sub, email: 'b@example.com', name: 'Second' })
    .onConflictDoUpdate({
      target: users.auth0Sub,
      set: { email: 'b@example.com', name: 'Second', updatedAt: new Date() },
    })
    .returning();
  console.log('Second call:', second);
  console.log('\nSame id?', first.id === second.id);
  console.log('Email updated?', second.email === 'b@example.com');

  console.log('\n-- Cleaning up test row --');
  await db.delete(users).where(like(users.auth0Sub, 'diag|%'));
  console.log('Done.');
}

main().catch((e) => {
  console.error('Unhandled:', e);
  process.exit(1);
});
