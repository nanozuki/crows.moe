import { neon, neonConfig } from '@neondatabase/serverless';
import { Ceremony } from '@service/entity';
import { dbUrl } from '@service/env';
import { CeremonyRepository } from '@service/use_case';
import { NeonHttpDatabase, drizzle } from 'drizzle-orm/neon-http';
import { ceremony } from './schema';
import * as schema from './schema';
import { desc, eq } from 'drizzle-orm';

neonConfig.fetchConnectionCache = true;

type Database = NeonHttpDatabase<typeof schema>;

export function initDB(): Database {
  const sql = neon(dbUrl);
  return drizzle(sql, { schema });
}

export class CeremonyRepositoryImpl implements CeremonyRepository {
  constructor(private db: Database) {}

  async find(year: number): Promise<Ceremony> {
    const result = await this.db.select().from(ceremony).where(eq(ceremony.year, year));
    if (result.length === 0) {
      throw new Error('Not found'); // TODO: Regularize error
    }
    return result[0];
  }

  async findAll(): Promise<Ceremony[]> {
    return await this.db.select().from(ceremony).orderBy(desc(ceremony.year));
  }
}
