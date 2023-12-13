import type { Ceremony, Work } from '$lib/domain/entity';
import type { CeremonyRepository, WorkRepository } from '$lib/server/adapter';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class CeremonyRepositoryImpl implements CeremonyRepository {
  constructor(private db: PostgresJsDatabase) {}
  getCeremonies(): Promise<Ceremony[]> {
    throw new Error('Method not implemented.');
  }
}

export class WorkRepositoryImpl implements WorkRepository {
  constructor(private db: PostgresJsDatabase) {}
  getAllWinners(): Promise<Map<number, Work[]>> {
    throw new Error('Method not implemented.');
  }
}
