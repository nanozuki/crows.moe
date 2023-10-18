import { v4 as uuidV4 } from 'uuid';
import { Award, Ballot, BallotInput, Voter, WorksSet, Year } from '@service/entity';
import { Department, RankedWork, Stage } from '@service/value';
import { NotInStageError } from '@service/errors';

export interface YearRepository {
  find(year: number): Promise<Year>;
  findAll(): Promise<Year[]>;
}

export class YearUseCase {
  constructor(private yearRepository: YearRepository) {}

  async find(year: number): Promise<Year> {
    return this.yearRepository.find(year);
  }

  async findAll(): Promise<Year[]> {
    return this.yearRepository.findAll();
  }

  async getInStage(year: number, stage: Stage): Promise<Year> {
    const y = await this.yearRepository.find(year);
    if (y.stageAt(new Date()) !== stage) {
      throw NotInStageError(stage);
    }
    return y;
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

export class VoterUseCase {
  constructor(private voterRepository: VoterRepository) {}

  async ensureAuth(year: number, sessionID: string): Promise<Voter> {
    return this.voterRepository.getBySessionID(year, sessionID);
  }

  async login(year: number, name: string, pin: string): Promise<Voter> {
    return this.voterRepository.getByNameAndPin(year, name, pin);
  }

  async signUp(year: number, name: string): Promise<[Voter, string]> {
    // generate pin from '10000' to '99999'
    const pin = Math.floor(Math.random() * 90000) + 10000;
    const voter = await this.voterRepository.createVoter(year, name, pin.toString());
    const sessionId = uuidV4();
    await this.voterRepository.createSessionID(year, voter, sessionId);
    return [voter, sessionId];
  }

  async makeSession(year: number, voter: Voter): Promise<string> {
    const sessionId = uuidV4();
    await this.voterRepository.createSessionID(year, voter, sessionId);
    return sessionId;
  }
}

export interface BallotRepository {
  getBallot(year: number, voter: Voter, department: Department): Promise<Ballot>;
  saveBallot(ballot: Ballot): Promise<void>;
}

export class BallotUseCase {
  constructor(private ballotRepository: BallotRepository) {}

  getBallot(year: number, voter: Voter, department: Department): Promise<Ballot> {
    return this.ballotRepository.getBallot(year, voter, department);
  }

  async putBallot(input: BallotInput): Promise<Ballot> {
    const ballot = new Ballot(input);
    await this.ballotRepository.saveBallot(ballot);
    return ballot;
  }
}

export interface AwardRepository {
  findAward(year: number, department: Department): Promise<Award | null>;
  saveAward(award: Award): Promise<void>;
}

export interface AwardCalculator {
  calculate(ballots: Ballot[]): Promise<RankedWork[]>;
}

export class AwardUseCase {
  constructor(
    private awardRepository: AwardRepository,
    private awardCalculator: AwardCalculator,
  ) {}

  async getAward(year: number, department: Department): Promise<Award> {
    const award = await this.awardRepository.findAward(year, department);
    if (award) {
      return award;
    }
    const rankings = await this.awardCalculator.calculate([]);
    const newAward = new Award(year, department, rankings);
    await this.awardRepository.saveAward(newAward);
    return newAward;
  }
}
