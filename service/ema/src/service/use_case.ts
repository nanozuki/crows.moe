import { v4 as uuidV4 } from 'uuid';
import { Award, Ballot, Voter, WorksSet, Ceremony, getStage } from '@service/entity';
import { Department, RankedWork, Stage } from '@service/value';
import { NotInStageError } from '@service/errors';

export interface CeremonyRepository {
  find(year: number): Promise<Ceremony>;
  findAll(): Promise<Ceremony[]>;
}

export class CeremonyUseCase {
  constructor(private repo: CeremonyRepository) {}

  async find(year: number): Promise<Ceremony> {
    return this.repo.find(year);
  }

  async current(): Promise<Ceremony> {
    const years = await this.repo.findAll();
    return years[0];
  }

  async findAll(): Promise<Ceremony[]> {
    return this.repo.findAll();
  }

  async getInStages(year: number, ...stages: Stage[]): Promise<Ceremony> {
    const c = await this.repo.find(year);
    for (const stage of stages) {
      if (getStage(c, new Date()) === stage) {
        return c;
      }
    }
    throw NotInStageError(...(stages as string[]));
  }
}

export interface WorksSetRepository {
  get(year: number, department: string): Promise<WorksSet>;
  save(year: number, department: string, works: WorksSet): Promise<void>;
}

export class WorksSetUseCase {
  constructor(private worksSetRepository: WorksSetRepository) {}

  async get(year: number, department: string): Promise<WorksSet> {
    return this.worksSetRepository.get(year, department);
  }

  async save(year: number, department: string, works: WorksSet): Promise<void> {
    return this.worksSetRepository.save(year, department, works);
  }
}

export interface VoterRepository {
  getBySessionID(year: number, sessionID: string): Promise<Voter>;
  getByNameAndPin(year: number, name: string, pin: string): Promise<Voter>;
  createVoter(year: number, name: string, pin: string): Promise<Voter>;
  createSessionID(year: number, voter: Voter, sessionId: string): Promise<void>;
}

export interface SignUpReply {
  voter: Voter;
  sessionId: string;
  pinCode: string;
}

export class VoterUseCase {
  constructor(private voterRepository: VoterRepository) {}

  async ensureAuth(year: number, sessionID: string): Promise<Voter> {
    return this.voterRepository.getBySessionID(year, sessionID);
  }

  async login(year: number, name: string, pin: string): Promise<Voter> {
    return this.voterRepository.getByNameAndPin(year, name, pin);
  }

  async signUp(year: number, name: string): Promise<SignUpReply> {
    // generate pin from '10000' to '99999'
    const pin = Math.floor(Math.random() * 90000) + 10000;
    const voter = await this.voterRepository.createVoter(year, name, pin.toString());
    const sessionId = uuidV4();
    await this.voterRepository.createSessionID(year, voter, sessionId);
    return { voter, sessionId, pinCode: pin.toString() };
  }

  async makeSession(year: number, voter: Voter): Promise<string> {
    const sessionId = uuidV4();
    await this.voterRepository.createSessionID(year, voter, sessionId);
    return sessionId;
  }
}

export interface BallotRepository {
  getBallot(year: number, voter: Voter, department: Department): Promise<Ballot>;
  getAllBallots(year: number, department: Department): Promise<Ballot[]>;
  saveBallot(year: number, department: Department, ballot: Ballot): Promise<void>;
}

export class BallotUseCase {
  constructor(private ballotRepository: BallotRepository) {}

  getBallot(year: number, voter: Voter, department: Department): Promise<Ballot> {
    return this.ballotRepository.getBallot(year, voter, department);
  }

  async putBallot(year: number, department: Department, ballot: Ballot): Promise<Ballot> {
    await this.ballotRepository.saveBallot(year, department, ballot);
    return ballot;
  }
}

export interface AwardRepository {
  findAward(year: number, department: Department): Promise<Award | null>;
  saveAward(year: number, department: Department, award: Award): Promise<void>;
}

export interface AwardCalculator {
  calculate(ballots: Ballot[]): Promise<RankedWork[]>; // TODO: implement
}

export class AwardUseCase {
  constructor(
    private awardRepository: AwardRepository,
    private ballotRepository: BallotRepository,
    private awardCalculator: AwardCalculator,
  ) {}

  async getAward(year: number, department: Department): Promise<Award> {
    const award = await this.awardRepository.findAward(year, department);
    if (award) {
      return award;
    }
    const ballots = await this.ballotRepository.getAllBallots(year, department);
    const rankings = await this.awardCalculator.calculate(ballots);
    await this.awardRepository.saveAward(year, department, { rankings });
    return { rankings };
  }
}
