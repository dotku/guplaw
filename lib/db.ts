import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Next.js dev mode re-imports modules on every request (HMR), which would
// otherwise create a new Neon client per request. Cache on globalThis so a
// single instance is reused across hot reloads. In production, module graph
// is cached by Node already, so the fallback path is fine.
type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __neonSql?: NeonQueryFunction<false, false>;
  __drizzleDb?: DbInstance;
};

const sql = globalForDb.__neonSql ?? neon(process.env.DATABASE_URL);
export const db: DbInstance =
  globalForDb.__drizzleDb ?? drizzle(sql, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__neonSql = sql;
  globalForDb.__drizzleDb = db;
}

export { schema };
