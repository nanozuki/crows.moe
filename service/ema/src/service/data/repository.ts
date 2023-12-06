import { neon, neonConfig } from '@neondatabase/serverless';
import { Ceremony, WorksSet } from '@service/entity';
import { dbUrl } from '@service/env';
import { CeremonyRepository, WorksSetRepository } from '@service/use_case';
import { NeonHttpDatabase, drizzle } from 'drizzle-orm/neon-http';
import { ceremony, work, workName } from './schema';
import { desc, eq, sql } from 'drizzle-orm';
import { Department } from '@service/value';

neonConfig.fetchConnectionCache = true;

type Database = NeonHttpDatabase;

export function initDB(): Database {
  const sql = neon(dbUrl);
  return drizzle(sql);
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

export class WorksSetRepositoryImpl implements WorksSetRepository {
  constructor(public db: Database) {}

  async get(year: number, department: Department): Promise<WorksSet> {
    const result = await this.db
      .select()
      .from(work)
      .leftJoin(workName, eq(work.id, workName.workId))
      .where(sql`${work.year} = ${year} AND ${work.department} = ${department}`)
      .orderBy(work.id);
    const names: Record<number, string> = {};
    const origin_names: Record<number, string> = {};
    const alias_names: Record<number, string[]> = {};
    for (const row of result) {
      if (row.work_name?.type === 'main') {
        names[row.work.id] = row.work_name.name;
      } else if (row.work_name?.type === 'origin') {
        origin_names[row.work.id] = row.work_name.name;
      } else if (row.work_name?.type === 'alias') {
        const alias = alias_names[row.work.id] || [];
        alias.push(row.work_name.name);
        alias_names[row.work.id] = alias;
      }
    }
    const works: WorksSet = [];
    for (const id in names) {
      works.push({
        name: names[id],
        originName: origin_names[id],
        alias: alias_names[id],
      });
    }
    return works;
  }

  async add(year: number, department: Department, name: string): Promise<void> {
    await this.db.transaction(
      async (trx) => {
        const names = await trx
          .select()
          .from(workName)
          .where(sql`${workName.name} = ${name}`);
        if (names.length != 0) {
          return;
        }
        const rows = await trx.insert(work).values({ year, department }).returning({ workId: work.id });
        const workId = rows[0].workId;
        await trx.insert(workName).values({ workId, name, type: 'main' });
      },
      { isolationLevel: 'serializable' },
    );
  }
}
