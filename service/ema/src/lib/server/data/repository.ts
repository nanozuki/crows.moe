import type { Ceremony, Vote, Voter, Work } from '$lib/domain/entity';
import type { CeremonyRepository, WorkRepository, VoterRepository, VoteRepository } from '$lib/server/adapter';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ceremony, rankingInVote, vote, voter, work } from './schema';
import { desc, eq, and, gte, or, sql } from 'drizzle-orm';
import type { Department } from '$lib/domain/value';
import bcrypt from 'bcrypt';
import { Err } from '$lib/domain/errors';

export class CeremonyRepositoryImpl implements CeremonyRepository {
  constructor(private db: PostgresJsDatabase) {}

  async getCeremonies(): Promise<Ceremony[]> {
    return Err.catch(
      async () => await this.db.select().from(ceremony).orderBy(desc(ceremony.year)),
      (err) => Err.Database('ceremony.getCeremonies', err),
    );
  }

  async getByYear(year: number): Promise<Ceremony> {
    const results = await Err.catch(
      async () => await this.db.select().from(ceremony).where(eq(ceremony.year, year)),
      (err) => Err.Database(`ceremony.getByYear(${year})`, err),
    );
    if (results.length == 0) {
      throw Err.NotFound('ceremony', year);
    }
    return results[0];
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
    const results = await Err.catch(
      async () => await this.db.select().from(work).where(eq(work.ranking, 1)),
      (err) => Err.Database('work.getAllWinners', err),
    );
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
    const results = await Err.catch(
      async () =>
        await this.db
          .select()
          .from(work)
          .where(and(eq(work.year, year), gte(work.ranking, 1)))
          .orderBy(work.department, work.ranking),
      (err) => Err.Database(`work.getAwardsByYear(${year})`, err),
    );
    const awards = new Map<Department, Work[]>();
    for (const result of results) {
      const department = result.department;
      awards.get(department) || awards.set(department, []);
      awards.get(department)?.push(modelToWork(result));
    }
    return awards;
  }

  async getWorksInDept(year: number, department: Department): Promise<Work[]> {
    const results = await Err.catch(
      async () =>
        await this.db
          .select()
          .from(work)
          .where(and(eq(work.year, year), eq(work.department, department)))
          .orderBy(work.id),
      (err) => Err.Database(`work.getWorksInDept(${year}, ${department})`, err),
    );
    return results.map(modelToWork);
  }

  async addNomination(year: number, department: Department, workName: string): Promise<void> {
    const operation = async () => {
      await this.db.transaction(
        async (db) => {
          const works = await db
            .select()
            .from(work)
            .where(
              and(
                eq(work.year, year),
                eq(work.department, department),
                or(eq(work.name, workName), eq(work.originName, workName), sql`${workName} = ANY(work.aliases)`),
              ),
            );
          if (works.length === 0) {
            await db.insert(work).values({ year, department, name: workName });
          }
        },
        { isolationLevel: 'serializable' },
      );
    };
    await Err.catch(operation, (err) => Err.Database(`work.addNomination(${year}, ${department}, ${workName})`, err));
  }

  async getById(id: number): Promise<Work> {
    const results = await Err.catch(
      async () => await this.db.select().from(work).where(eq(work.id, id)),
      (err) => Err.Database(`work.getById(${id})`, err),
    );
    if (results.length === 0) {
      throw Err.NotFound('work', id);
    }
    return modelToWork(results[0]);
  }
}

export class VoterRepositoryImpl implements VoterRepository {
  constructor(private db: PostgresJsDatabase) {}

  async findVoter(name: string): Promise<Voter | undefined> {
    const results = await Err.catch(
      async () => await this.db.select().from(voter).where(eq(voter.name, name)),
      (err) => Err.Database(`voter.getVoterByName(${name})`, err),
    );
    if (results.length == 0) {
      return undefined;
    }
    return {
      id: results[0].id,
      name: results[0].name,
      hasPassword: results[0].passwordHash != null,
    };
  }

  async createVoter(name: string, password: string): Promise<Voter> {
    const passwordHash = await Err.catch(
      async () => await bcrypt.hash(password, 10),
      (err) => Err.Internal('bcrypt.hash(password)', err),
    );
    const result = await Err.catch(
      async () => await this.db.insert(voter).values({ name, passwordHash }).returning({ id: voter.id }),
      (err) => Err.Database(`voter.createVoter(${name}, ${password})`, err),
    );
    return { id: result[0].id, name, hasPassword: true };
  }

  async setPassword(name: string, password: string): Promise<Voter> {
    const passwordHash = await Err.catch(
      async () => await bcrypt.hash(password, 10),
      (err) => Err.Internal('bcrypt.hash(password)', err),
    );
    const result = await Err.catch(
      async () =>
        await this.db.update(voter).set({ passwordHash }).where(eq(voter.name, name)).returning({ id: voter.id }),
      (err) => Err.Database(`voter.setPassword(${name}, ${password})`, err),
    );
    return { id: result[0].id, name, hasPassword: true };
  }

  async verifyPassword(name: string, password: string): Promise<Voter | undefined> {
    const results = await Err.catch(
      async () => await this.db.select().from(voter).where(eq(voter.name, name)),
      (err) => Err.Database(`voter.verifyPassword(${name}, ${password})`, err),
    );
    const passwordHash = results[0] && results[0].passwordHash;
    if (!passwordHash) {
      return undefined;
    }
    const equal = await Err.catch(
      async () => await bcrypt.compare(password, passwordHash),
      (err) => Err.Internal('bcrypt.compare(password, passwordHash)', err),
    );
    if (!equal) {
      return undefined;
    }
    return {
      id: results[0].id,
      name: results[0].name,
      hasPassword: true,
    };
  }
}

export class VoteRepositoryImpl implements VoteRepository {
  constructor(private db: PostgresJsDatabase) {}

  async getVote(year: number, department: Department, voterId: number): Promise<Vote | undefined> {
    return await Err.catch(
      async () => {
        const voteRows = await this.db
          .select()
          .from(vote)
          .where(and(eq(vote.year, year), eq(vote.department, department), eq(vote.voterId, voterId)));
        if (voteRows.length == 0) {
          return undefined;
        }
        const v = voteRows[0];
        const rankingsRows = await this.db
          .select()
          .from(rankingInVote)
          .leftJoin(work, eq(rankingInVote.workId, work.id))
          .where(eq(rankingInVote.voteId, v.id))
          .orderBy(rankingInVote.ranking, rankingInVote.workId);
        const rankings = rankingsRows.map((r) => {
          const work = modelToWork(r.work!);
          work.ranking = r.ranking_in_vote.ranking;
          return work;
        });
        return { ...v, rankings };
      },
      (err) => Err.Database(`vote.getVote(${year}, ${department}, ${voterId})`, err),
    );
  }

  async setVote(year: number, department: Department, voterId: number, works: Work[]): Promise<void> {
    return await Err.catch(
      async () => {
        await this.db.insert(vote).values({ year, department, voterId }).onConflictDoNothing();
        const idRow = await this.db
          .select()
          .from(vote)
          .where(and(eq(vote.year, year), eq(vote.department, department), eq(vote.voterId, voterId)));
        const id = idRow[0].id;
        const rankingsRows = works.map((r) => ({ voteId: id, ranking: r.ranking!, workId: r.id }));
        await this.db.transaction(
          async (db) => {
            await db.delete(rankingInVote).where(eq(rankingInVote.voteId, id));
            await db.insert(rankingInVote).values(rankingsRows);
          },
          { isolationLevel: 'serializable' },
        );
      },
      (err) => Err.Database(`vote.setVote(${year}, ${department}, ${voterId}, ${works})`, err),
    );
  }
}
