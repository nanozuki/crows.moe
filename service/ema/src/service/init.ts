import { Service } from '@service/service';
import { Firestore } from '@google-cloud/firestore';
import {
  AwardRepositoryImpl,
  BallotRepositoryImpl,
  VoterRepositoryImpl,
  WorksSetRepositoryImpl,
  CeremonyRepositoryImpl,
  generateDevData,
} from '@service/data/repository';
import { AwardUseCase, BallotUseCase, VoterUseCase, WorksSetUseCase, CeremonyUseCase } from '@service/use_case';
import { Calculator } from '@service/calculator';
import { isDev } from '@service/env';

const projectId = 'crows-moe';
const databaseId = 'exodus-media-awards';

async function make_service(): Promise<Service> {
  const db = new Firestore({ projectId, databaseId, ignoreUndefinedProperties: true });
  const calculator = new Calculator();
  const ballotRepository = new BallotRepositoryImpl(db);
  const service = new Service(
    new CeremonyUseCase(new CeremonyRepositoryImpl(db)),
    new WorksSetUseCase(new WorksSetRepositoryImpl(db)),
    new VoterUseCase(new VoterRepositoryImpl(db)),
    new BallotUseCase(ballotRepository),
    new AwardUseCase(new AwardRepositoryImpl(db), ballotRepository, calculator),
  );
  if (isDev) {
    await generateDevData(db);
  }
  return service;
}

let service: Service;

export const getService = async function () {
  if (service) {
    return service;
  }
  service = await make_service();
  return service;
};
