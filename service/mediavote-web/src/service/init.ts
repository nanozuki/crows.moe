import { Service } from '@service/service';
import { Firestore } from '@google-cloud/firestore';
import {
  AwardRepositoryImpl,
  BallotRepositoryImpl,
  VoterRepositoryImpl,
  WorksSetRepositoryImpl,
  YearRepositoryImpl,
  generateDevData,
} from '@service/data/repository';
import { AwardUseCase, BallotUseCase, VoterUseCase, WorksSetUseCase, YearUseCase } from '@service/use_case';
import { Calculator } from '@service/calculator';

const projectId = 'crows-moe';

async function make_service(): Promise<Service> {
  const db = new Firestore({ projectId });
  const calculator = new Calculator();
  const service = new Service(
    new YearUseCase(new YearRepositoryImpl(db)),
    new WorksSetUseCase(new WorksSetRepositoryImpl(db)),
    new VoterUseCase(new VoterRepositoryImpl(db)),
    new BallotUseCase(new BallotRepositoryImpl(db)),
    new AwardUseCase(new AwardRepositoryImpl(db), calculator),
  );
  if (process.env.NODE_ENV === 'development') {
    await generateDevData(db);
  }
  return service;
}

export const service = make_service();
