import { Service } from '$lib/server/service';
import { CeremonyRepositoryImpl, WorkRepositoryImpl } from '$lib/server/data/repository';
import { env } from '$env/dynamic/private';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

function initService(): Service {
  const dbClient = drizzle(postgres(env.EMA_POSTGRES_URL!), { logger: true });
  const ceremony = new CeremonyRepositoryImpl(dbClient);
  const work = new WorkRepositoryImpl(dbClient);
  return new Service(ceremony, work);
}

let service: Service | undefined;

export function getService(): Service {
  if (!service) {
    service = initService();
  }
  return service;
}
