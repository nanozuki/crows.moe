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
    const y = await getOne<YearDoc>(this.db, [[colCeremony, year.toString()]]);
    return yearDocToEntity(y);
  }

  async findAll(): Promise<Ceremony[]> {
    const ys = await getAll<YearDoc>(this.db, [], colCeremony);
    const years = ys.map(yearDocToEntity);
    years.sort((a, b) => b.year - a.year);
    return years;
  }
}

export class WorksSetRepositoryImpl implements WorksSetRepository {
  constructor(public db: Firestore) {}

  async get(year: number, department: string): Promise<WorksSet> {
    const ws = await getOne<DepartmentDoc>(this.db, [
      [colCeremony, year.toString()],
      [colDepartment, department],
    ]);
    return departmentDocToEntity(year, ws);
  }

  async save(year: number, department: string, worksSet: WorksSet): Promise<void> {
    return setOne<DepartmentDoc>(
      this.db,
      [
        [colCeremony, year.toString()],
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
      [colCeremony, year.toString()],
      [colSession, sessionID],
    ]);
    return new Voter(doc.name, ''); // TODO: fix pin_code
  }

  async getByNameAndPin(year: number, name: string, pin: string): Promise<Voter> {
    const doc = await getOne<VoterDoc>(this.db, [
      [colCeremony, year.toString()],
      [colVoter, name],
    ]);
    if (doc.pin_code !== pin) {
      throw InvalidPinCodeError();
    }
    return new Voter(doc.name, doc.pin_code);
  }

  async createVoter(year: number, name: string, pin: string): Promise<Voter> {
    await setOne<VoterDoc>(
      this.db,
      [
        [colCeremony, year.toString()],
        [colVoter, name],
      ],
      { name, pin_code: pin },
    );
    return new Voter(name, pin);
  }

  async createSessionID(year: number, voter: Voter, sessionId: string): Promise<void> {
    await setOne<SessionDoc>(
      this.db,
      [
        [colCeremony, year.toString()],
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
      [colCeremony, year.toString()],
      [colBallot, ballotId],
    ]);
    const dept = await getOne<DepartmentDoc>(this.db, [
      [colCeremony, year.toString()],
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
        [colCeremony, ballot.year.toString()],
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
      [colCeremony, year.toString()],
      [colAward, department],
    ]);
    return awardDocToEntity(doc, year);
  }

  async saveAward(award: Award): Promise<void> {
    const doc = awardDocFromEntity(award);
    return setOne<AwardDoc>(
      this.db,
      [
        [colCeremony, award.year.toString()],
        [colAward, award.department],
      ],
      doc,
    );
  }
}

export async function generateDevData(db: Firestore): Promise<void> {
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
    await setOne<YearDoc>(db, [[colCeremony, y.toString()]], year);
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
        await setOne<DepartmentDoc>(
          db,
          [
            [colCeremony, y.toString()],
            [colDepartment, dept],
          ],
          { dept, works },
        );
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
        await setOne<AwardDoc>(
          db,
          [
            [colCeremony, y.toString()],
            [colAward, dept],
          ],
          { dept, rankings },
        );
      }
    }
  }
}
