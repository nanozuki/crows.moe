import { Firestore, Timestamp } from '@google-cloud/firestore';
import {
  AwardRepository,
  BallotRepository,
  VoterRepository,
  WorksSetRepository,
  CeremonyRepository,
} from '@service/use_case';
import { Award, Ballot, Voter, WorksSet, Ceremony } from '@service/entity';
import { InvalidPinCodeError } from '@service/errors';
import {
  AwardDoc,
  BallotDoc,
  DepartmentDoc,
  SessionDoc,
  VoterDoc,
  WorkDoc,
  YearDoc,
  awardDocFromEntity,
  awardDocToEntity,
  ballotDocFromEntity,
  ballotDocToEntity,
  departmentDocFromEntity,
  departmentDocToEntity,
  getAll,
  getOne,
  setOne,
  yearDocToEntity,
} from './doc';
import { Department, Stage } from '@service/value';
import { chineseLipsum, englishLipsum, japaneseLipsum } from '@service/pkg/lipsum';

/* collections:
mediavote_years: store yearly time infos
	-> departments: {dept -> works[]}
	-> voters:      {name -> {name, pinCode}}
	-> sessions:    {key -> user}
	-> ballots:     {dept,voteName -> rankings}
	-> awards:      {dept -> rankings}
*/

const colCeremony = 'mediavote_years';
const colDepartment = 'departments';
const colVoter = 'voters';
const colSession = 'sessions';
const colBallot = 'ballots';
const colAward = 'awards';

export class CeremonyRepositoryImpl implements CeremonyRepository {
  constructor(private db: Firestore) {}

  async find(year: number): Promise<Ceremony> {
    const y = await getOne<YearDoc>(this.db, colCeremony, year.toString());
    return yearDocToEntity(y);
  }

  async findAll(): Promise<Ceremony[]> {
    const ys = await getAll<YearDoc>(this.db, colCeremony);
    const years = ys.map(yearDocToEntity);
    years.sort((a, b) => b.year - a.year);
    return years;
  }
}

export class WorksSetRepositoryImpl implements WorksSetRepository {
  constructor(public db: Firestore) {}

  async get(year: number, department: string): Promise<WorksSet> {
    const ws = await getOne<DepartmentDoc>(this.db, colCeremony, year.toString(), colDepartment, department);
    return departmentDocToEntity(ws);
  }

  async save(year: number, department: string, worksSet: WorksSet): Promise<void> {
    return setOne<DepartmentDoc>(
      this.db,
      departmentDocFromEntity(worksSet),
      colCeremony,
      year.toString(),
      colDepartment,
      department,
    );
  }
}

export class VoterRepositoryImpl implements VoterRepository {
  constructor(public db: Firestore) {}

  async getBySessionID(year: number, sessionID: string): Promise<Voter> {
    const doc = await getOne<SessionDoc>(this.db, colCeremony, year.toString(), colSession, sessionID);
    return { name: doc.name };
  }

  async getByNameAndPin(year: number, name: string, pin: string): Promise<Voter> {
    const doc = await getOne<VoterDoc>(this.db, colCeremony, year.toString(), colVoter, name);
    if (doc.pin_code !== pin) {
      throw InvalidPinCodeError();
    }
    return { name: doc.name };
  }

  async createVoter(year: number, name: string, pin: string): Promise<Voter> {
    await setOne<VoterDoc>(this.db, { name, pin_code: pin }, colCeremony, year.toString(), colVoter, name);
    return { name };
  }

  async createSessionID(year: number, voter: Voter, sessionId: string): Promise<void> {
    await setOne<SessionDoc>(this.db, { name: voter.name }, colCeremony, year.toString(), colSession, sessionId);
  }
}

export class BallotRepositoryImpl implements BallotRepository {
  constructor(public db: Firestore) {}

  async getBallot(year: number, voter: Voter, department: Department): Promise<Ballot> {
    const ballotId = `${voter.name}#${department}`;
    const ballot = await getOne<BallotDoc>(this.db, colCeremony, year.toString(), colBallot, ballotId);
    const dept = await getOne<DepartmentDoc>(this.db, colCeremony, year.toString(), colDepartment, department);
    return ballotDocToEntity(ballot, dept);
  }

  async getAllBallots(year: number, department: Department): Promise<Ballot[]> {
    const ballots = await getAll<BallotDoc>(this.db, colCeremony, year.toString(), colBallot);
    const dept = await getOne<DepartmentDoc>(this.db, colCeremony, year.toString(), colDepartment, department);
    return ballots
      .filter((ballot) => ballot.voter.endsWith(`#${department}`))
      .map((ballot) => ballotDocToEntity(ballot, dept));
  }

  saveBallot(year: number, department: Department, ballot: Ballot): Promise<void> {
    const ballotId = `${ballot.voter}#${department}`;
    return setOne<BallotDoc>(this.db, ballotDocFromEntity(ballot), colCeremony, year.toString(), colBallot, ballotId);
  }
}

export class AwardRepositoryImpl implements AwardRepository {
  constructor(public db: Firestore) {}

  async findAward(year: number, department: Department): Promise<Award | null> {
    const doc = await getOne<AwardDoc>(this.db, colCeremony, year.toString(), colAward, department);
    return awardDocToEntity(doc);
  }

  async saveAward(year: number, department: Department, award: Award): Promise<void> {
    const doc = awardDocFromEntity(award);
    return setOne<AwardDoc>(this.db, doc, colCeremony, year.toString(), colAward, department);
  }
}

export async function generateDevData(db: Firestore): Promise<void> {
  console.log('!!! ATTENTION: Make Dev Data !!!');
  const now = Timestamp.now();
  const currentYear = now.toDate().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const departments = [Department.Anime, Department.MangaAndNovel, Department.Game];
  const devStage = process.env['MEDIAVOTE_DEV_STAGE'] as Stage;
  for (const y of years) {
    const year = {
      year: y,
      nomination_start_at: Timestamp.fromDate(new Date(y, 12, 1)),
      voting_start_at: Timestamp.fromDate(new Date(y, 12, 15)),
      award_start_at: Timestamp.fromDate(new Date(y, 12, 31)),
      departments,
    };
    if (y === currentYear) {
      switch (devStage) {
        case Stage.Nomination:
          year.nomination_start_at = new Timestamp(now.seconds - 86400 * 7, 0);
          year.voting_start_at = new Timestamp(now.seconds + 86400 * 7, 0);
          year.award_start_at = new Timestamp(now.seconds + 86400 * 14, 0);
          break;
        case Stage.Voting:
          year.nomination_start_at = new Timestamp(now.seconds - 86400 * 14, 0);
          year.voting_start_at = new Timestamp(now.seconds - 86400 * 7, 0);
          year.award_start_at = new Timestamp(now.seconds + 86400 * 7, 0);
          break;
        case Stage.Award:
          year.nomination_start_at = new Timestamp(now.seconds - 86400 * 21, 0);
          year.voting_start_at = new Timestamp(now.seconds - 86400 * 14, 0);
          year.award_start_at = new Timestamp(now.seconds - 86400 * 7, 0);
          break;
        default:
          throw new Error(`Invalid dev stage: ${devStage}`);
      }
    }
    await setOne<YearDoc>(db, year, colCeremony, y.toString());
    if ((y === currentYear && devStage === Stage.Nomination) || devStage === Stage.Voting) {
      for (const dept of departments) {
        const works: WorkDoc[] = [];
        for (let i = 0; i < 10; i++) {
          works.push({
            name: chineseLipsum(),
            origin_name: dept === Department.Game ? englishLipsum() : japaneseLipsum(),
            alias: [chineseLipsum()],
          });
        }
        await setOne<DepartmentDoc>(db, { works }, colCeremony, y.toString(), colDepartment, dept);
      }
    } else {
      for (const dept of departments) {
        const works: WorkDoc[] = [];
        for (let i = 0; i < 10; i++) {
          works.push({
            name: chineseLipsum(),
            origin_name: dept === Department.Game ? englishLipsum() : japaneseLipsum(),
            alias: [chineseLipsum()],
          });
        }
        const rankings = works.map((work, i) => ({ ranking: i + 1, work }));
        await setOne<AwardDoc>(db, { rankings }, colCeremony, y.toString(), colAward, dept);
      }
    }
  }
}
