import { Service } from '$lib/server/service';
import {
  CeremonyRepositoryImpl,
  WorkRepositoryImpl,
  VoterRepositoryImpl,
  VoteRepositoryImpl,
} from '$lib/server/data/repository';
import { env } from '$env/dynamic/private';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { calculator } from '$lib/server/calculate';

function initService(): Service {
  const dbClient = drizzle(postgres(env.EMA_POSTGRES_URL!), { logger: true });
  const ceremony = new CeremonyRepositoryImpl(dbClient);
  const work = new WorkRepositoryImpl(dbClient);
  const voter = new VoterRepositoryImpl(dbClient);
  const vote = new VoteRepositoryImpl(dbClient);
  return new Service(ceremony, work, voter, vote, calculator);
}

let service: Service | undefined;

export function getService(): Service {
  if (!service) {
    service = initService();
  }
  return service;
}
