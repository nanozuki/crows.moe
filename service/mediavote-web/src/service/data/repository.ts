import { Firestore } from '@google-cloud/firestore';
import {
  AwardRepository,
  BallotRepository,
  VoterRepository,
  WorksSetRepository,
  YearRepository,
} from '@service/use_case';
import { Award, Ballot, Voter, WorksSet, Year } from '@service/entity';
import { InvalidPinCodeError } from '@service/errors';
import {
  AwardDoc,
  BallotDoc,
  DepartmentDoc,
  SessionDoc,
  VoterDoc,
  YearDoc,
  awardDocFromEntity,
  awardDocToEntity,
  departmentDocFromEntity,
  departmentDocToEntity,
  getAll,
  getOne,
  setOne,
  yearDocToEntity,
} from './doc';
import { Department } from '@service/value';

/* collections:
mediavote_years: store yearly time infos
	-> departments: {dept -> works[]}
	-> voters:      {name -> {name, pinCode}}
	-> sessions:    {key -> user}
	-> ballots:     {dept,voteName -> rankings}
	-> awards:      {dept -> rankings}
*/

const colYear = 'mediavote_years';
const colDepartment = 'departments';
const colVoter = 'voters';
const colSession = 'sessions';
const colBallot = 'ballots';
const colAward = 'awards';

export class YearRepositoryImpl implements YearRepository {
  constructor(private db: Firestore) {}

  async find(year: number): Promise<Year> {
    const y = await getOne<YearDoc>(this.db, [[colYear, year.toString()]]);
    return yearDocToEntity(y);
  }

  async findAll(): Promise<Year[]> {
    const ys = await getAll<YearDoc>(this.db, [], colYear);
    return ys.map(yearDocToEntity);
  }
}

export class WorksSetRepositoryImpl implements WorksSetRepository {
  constructor(public db: Firestore) {}

  async get(year: number, department: string): Promise<WorksSet> {
    const ws = await getOne<DepartmentDoc>(this.db, [
      [colYear, year.toString()],
      [colDepartment, department],
    ]);
    return departmentDocToEntity(year, ws);
  }

  async save(year: number, department: string, worksSet: WorksSet): Promise<void> {
    return setOne<DepartmentDoc>(
      this.db,
      [
        [colYear, year.toString()],
        [colDepartment, department],
      ],
      departmentDocFromEntity(worksSet),
    );
  }
}

export class VoterRepositoryImpl implements VoterRepository {
  constructor(public db: Firestore) {}

  async getBySessionID(year: number, sessionID: string): Promise<Voter> {
    const doc = await getOne<SessionDoc>(this.db, [
      [colYear, year.toString()],
      [colSession, sessionID],
    ]);
    return new Voter(doc.name);
  }

  async getByNameAndPin(year: number, name: string, pin: string): Promise<Voter> {
    const doc = await getOne<VoterDoc>(this.db, [
      [colYear, year.toString()],
      [colVoter, name],
    ]);
    if (doc.pin_code !== pin) {
      throw InvalidPinCodeError();
    }
    return new Voter(doc.name);
  }

  async createVoter(year: number, name: string, pin: string): Promise<Voter> {
    await setOne<VoterDoc>(
      this.db,
      [
        [colYear, year.toString()],
        [colVoter, name],
      ],
      { name, pin_code: pin },
    );
    return new Voter(name);
  }

  async createSessionID(year: number, voter: Voter, sessionId: string): Promise<void> {
    await setOne<SessionDoc>(
      this.db,
      [
        [colYear, year.toString()],
        [colSession, sessionId],
      ],
      { name: voter.name },
    );
  }
}

export class BallotRepositoryImpl implements BallotRepository {
  constructor(public db: Firestore) {}

  async getBallot(year: number, voter: Voter, department: Department): Promise<Ballot> {
    const ballotId = `${voter.name}#${department}`;
    const ballot = await getOne<BallotDoc>(this.db, [
      [colYear, year.toString()],
      [colBallot, ballotId],
    ]);
    const dept = await getOne<DepartmentDoc>(this.db, [
      [colYear, year.toString()],
      [colDepartment, department],
    ]);
    return new Ballot({
      year,
      voter: voter,
      department,
      worksSet: departmentDocToEntity(year, dept),
      rankings: ballot.rankings.map(({ ranking, work_name }) => ({
        ranking,
        workName: work_name,
      })),
    });
  }

  saveBallot(ballot: Ballot): Promise<void> {
    const ballotId = `${ballot.voter}#${ballot.department}`;
    const rankings = ballot.rankings.map(({ ranking, work }) => ({
      ranking,
      work_name: work.name,
    }));
    return setOne<BallotDoc>(
      this.db,
      [
        [colYear, ballot.year.toString()],
        [colBallot, ballotId],
      ],
      { dept: ballot.department, voter: ballot.voter.name, rankings },
    );
  }
}

export class AwardRepositoryImpl implements AwardRepository {
  constructor(public db: Firestore) {}

  async findAward(year: number, department: Department): Promise<Award | null> {
    const doc = await getOne<AwardDoc>(this.db, [
      [colYear, year.toString()],
      [colAward, department],
    ]);
    return awardDocToEntity(doc, year);
  }

  async saveAward(award: Award): Promise<void> {
    const doc = awardDocFromEntity(award);
    return setOne<AwardDoc>(
      this.db,
      [
        [colYear, award.year.toString()],
        [colAward, award.department],
      ],
      doc,
    );
  }
}
