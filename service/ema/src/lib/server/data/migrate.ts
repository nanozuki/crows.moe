import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(process.env.EMA_POSTGRES_URL!);
await migrate(drizzle(migrationClient), { migrationsFolder: './migrations' });
await migrationClient.end();
