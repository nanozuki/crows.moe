import type { Ceremony, Vote, VoteRank, Voter, Work } from '$lib/domain/entity';
import type { CeremonyRepository, WorkRepository, VoterRepository, VoteRepository } from '$lib/server/adapter';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ceremony, rankingInVote, vote, voter, work } from './schema';
import { desc, eq, and, gte } from 'drizzle-orm';
import type { Department } from '$lib/domain/value';
import bcrypt from 'bcrypt';

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

  async getWorksInDept(year: number, department: Department): Promise<Work[]> {
    const results = await this.db
      .select()
      .from(work)
      .where(and(eq(work.year, year), eq(work.department, department)))
      .orderBy(work.id);
    return results.map(modelToWork);
  }

  async addNomination(year: number, department: Department, workName: string): Promise<void> {
    await this.db.insert(work).values({ year, department, name: workName }); //.onConflictDoNothing();
  }

  async getById(id: number): Promise<Work | undefined> {
    const results = await this.db.select().from(work).where(eq(work.id, id));
    if (results.length == 0) {
      return undefined;
    }
    return modelToWork(results[0]);
  }
}

export class VoterRepositoryImpl implements VoterRepository {
  constructor(private db: PostgresJsDatabase) {}

  async getVoterByName(name: string): Promise<Voter | undefined> {
    const results = await this.db.select().from(voter).where(eq(voter.name, name));
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
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await this.db.insert(voter).values({ name, passwordHash }).returning({ id: voter.id });
    return { id: result[0].id, name, hasPassword: true };
  }

  async setPassword(name: string, password: string): Promise<Voter> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const result = await this.db
      .update(voter)
      .set({ passwordHash })
      .where(eq(voter.name, name))
      .returning({ id: voter.id });
    return { id: result[0].id, name, hasPassword: true };
  }

  async verifyPassword(name: string, password: string): Promise<Voter | undefined> {
    const results = await this.db.select().from(voter).where(eq(voter.name, name));
    if (results.length == 0) {
      return undefined;
    }
    const passwordHash = results[0].passwordHash;
    if (passwordHash == null) {
      return undefined;
    }
    if (await bcrypt.compare(password, passwordHash)) {
      return {
        id: results[0].id,
        name: results[0].name,
        hasPassword: true,
      };
    } else {
      return undefined;
    }
  }
}

export class VoteRepositoryImpl implements VoteRepository {
  constructor(private db: PostgresJsDatabase) {}

  async getVote(year: number, department: Department, voterId: number): Promise<Vote | undefined> {
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
    const rankings = rankingsRows.map((r) => ({
      ranking: r.ranking_in_vote.ranking,
      work: modelToWork(r.work!),
    }));
    return { ...v, rankings };
  }

  async setVote(year: number, department: Department, voterId: number, rankings: VoteRank[]): Promise<void> {
    await this.db.insert(vote).values({ year, department, voterId }).onConflictDoNothing();
    const idRow = await this.db
      .select()
      .from(vote)
      .where(and(eq(vote.year, year), eq(vote.department, department), eq(vote.voterId, voterId)));
    const id = idRow[0].id;
    const rankingsRows = rankings.map((r) => ({ voteId: id, ranking: r.ranking, workId: r.work.id }));
    await this.db.transaction(
      async (db) => {
        await db.delete(rankingInVote).where(eq(rankingInVote.voteId, id));
        await db.insert(rankingInVote).values(rankingsRows);
      },
      { isolationLevel: 'serializable' },
    );
  }
}
