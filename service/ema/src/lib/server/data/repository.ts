import type { Ceremony, Work } from '$lib/domain/entity';
import type { CeremonyRepository, WorkRepository } from '$lib/server/adapter';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ceremony, work } from './schema';
import { desc, eq, and, gte } from 'drizzle-orm';
import type { Department } from '$lib/domain/value';

export class CeremonyRepositoryImpl implements CeremonyRepository {
  constructor(private db: PostgresJsDatabase) {}

  async getCeremonies(): Promise<Ceremony[]> {
    return await this.db.select().from(ceremony).orderBy(desc(ceremony.year));
  }
}

function modelToWork({ id, year, department, name, originName, aliases, ranking }: typeof work.$inferSelect): Work {
  return {
    id,
    year,
    department,
    name,
    originName: originName || name,
    aliases: aliases || [],
    ranking: ranking || undefined,
  };
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
      works.get(year)?.push(modelToWork(result));
    }
    return works;
  }

  async getAwardsByYear(year: number): Promise<Map<Department, Work[]>> {
    const results = await this.db
      .select()
      .from(work)
      .where(and(eq(work.year, year), gte(work.ranking, 1)))
      .orderBy(work.department, work.ranking);
    const awards = new Map<Department, Work[]>();
    for (const result of results) {
      const department = result.department;
      if (!awards.has(department)) {
        awards.set(department, []);
      }
      awards.get(department)?.push(modelToWork(result));
    }
    return awards;
  }
}
