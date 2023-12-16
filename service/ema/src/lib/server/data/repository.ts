import type { Ceremony, Work } from '$lib/domain/entity';
import type { CeremonyRepository, WorkRepository } from '$lib/server/adapter';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ceremony, work } from './schema';
import { desc, eq } from 'drizzle-orm';

export class CeremonyRepositoryImpl implements CeremonyRepository {
  constructor(private db: PostgresJsDatabase) {}

  async getCeremonies(): Promise<Ceremony[]> {
    return await this.db.select().from(ceremony).orderBy(desc(ceremony.year));
  }
}

export class WorkRepositoryImpl implements WorkRepository {
  constructor(private db: PostgresJsDatabase) {}

  async getAllWinners(): Promise<Map<number, Work[]>> {
    const results = await this.db.select().from(work).where(eq(work.ranking, 1));
    const works = new Map<number, Work[]>();
    for (const result of results) {
      const year = result.year;
      if (!works.has(year)) {
        works.set(year, []);
      }
      works.get(year)?.push({
        id: result.id,
        year: result.year,
        department: result.department,
        name: result.name,
        originName: result.originName || result.name,
        aliases: result.aliases || [],
        ranking: result.ranking || undefined,
      });
    }
    return works;
  }
}
