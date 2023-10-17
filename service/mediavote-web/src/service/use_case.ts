import {
  Award,
  Ballot,
  BallotInput,
  Voter,
  WorksSet,
  Year,
} from "@service/entity";
import { Department, RankedWork, RankedWorkName, Stage } from "@service/value";
import { NotInStageError } from "@service/errors";

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
  getByName(year: number, name: string): Promise<Voter>;
  createVoter(year: number, name: string): Promise<Voter>;
  createSessionID(year: number, voter: Voter): Promise<string>;
}

export class VoterUseCase {
  constructor(private voterRepository: VoterRepository) {}

  async getBySessionID(year: number, sessionID: string): Promise<Voter> {
    return this.voterRepository.getBySessionID(year, sessionID);
  }

  async getByName(year: number, name: string): Promise<Voter> {
    return this.voterRepository.getByName(year, name);
  }

  async createVoter(year: number, name: string): Promise<[Voter, string]> {
    const voter = await this.voterRepository.createVoter(year, name);
    const sessionID = await this.voterRepository.createSessionID(year, voter);
    return [voter, sessionID];
  }

  async createSessionID(year: number, voter: Voter): Promise<string> {
    return this.voterRepository.createSessionID(year, voter);
  }
}

export interface BallotRepository {
  getBallot(
    year: number,
    voter: Voter,
    department: Department,
  ): Promise<Ballot>;
  saveBallot(ballot: Ballot): Promise<void>;
}

export class BallotUseCase {
  constructor(private ballotRepository: BallotRepository) {}

  getBallot(
    year: number,
    voter: Voter,
    department: Department,
  ): Promise<Ballot> {
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

export interface AwardCaculator {
  calculate(ballots: Ballot[]): Promise<RankedWork[]>;
}

export class AwardUseCase {
  constructor(
    private awardRepository: AwardRepository,
    private awardCaculator: AwardCaculator,
  ) {}

  async getAward(year: number, department: Department): Promise<Award> {
    const award = await this.awardRepository.findAward(year, department);
    if (award) {
      return award;
    }
    const rankings = await this.awardCaculator.calculate([]);
    const newAward = new Award(year, department, rankings);
    await this.awardRepository.saveAward(newAward);
    return newAward;
  }
}
