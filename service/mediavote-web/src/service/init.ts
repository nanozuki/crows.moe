import { Service } from '@service/service';
import { Firestore } from '@google-cloud/firestore';
import {
  AwardRepositoryImpl,
  BallotRepositoryImpl,
  VoterRepositoryImpl,
  WorksSetRepositoryImpl,
  YearRepositoryImpl,
} from './data/repository';
import { AwardUseCase, BallotUseCase, VoterUseCase, WorksSetUseCase, YearUseCase } from './use_case';
import { Calculator } from './calculator';

const projectId = 'crows-moe';

function make_service(): Service {
  const db = new Firestore({ projectId });
  const calculator = new Calculator();
  const service = new Service(
    new YearUseCase(new YearRepositoryImpl(db)),
    new WorksSetUseCase(new WorksSetRepositoryImpl(db)),
    new VoterUseCase(new VoterRepositoryImpl(db)),
    new BallotUseCase(new BallotRepositoryImpl(db)),
    new AwardUseCase(new AwardRepositoryImpl(db), calculator),
  );
  return service;
}

export const service = make_service();
