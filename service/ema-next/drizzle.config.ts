import type { Config } from 'drizzle-kit';

export default {
  schema: 'src/lib/server/data/schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.EMA_POSTGRES_URL!,
  },
} satisfies Config;
