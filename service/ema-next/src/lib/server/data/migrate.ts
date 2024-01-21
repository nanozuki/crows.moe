import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres('postgresql://ema:ema@localhost:5432/ema');
await migrate(drizzle(migrationClient), { migrationsFolder: './migrations' });
await migrationClient.end();
