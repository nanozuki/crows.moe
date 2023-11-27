import {
  AwardUseCase,
  BallotUseCase,
  VoterUseCase,
  WorksSetUseCase,
  CeremonyUseCase,
  SignUpReply,
} from '@service/use_case';
import {
  Award,
  Ballot,
  Voter,
  Ceremony,
  validateDepartment,
  addWorkToSet,
  getStage,
  makeRankingsFromNames,
} from '@service/entity';
import { Department, RankedWorkName, Stage, Work } from '@service/value';
import { ErrorCode, NoSessionIDError, Terror } from '@service/errors';
import { cookies } from 'next/headers';

export class Service {
  constructor(
    private readonly ceremony: CeremonyUseCase,
    private readonly worksSet: WorksSetUseCase,
    private readonly voter: VoterUseCase,
    private readonly ballot: BallotUseCase,
    private readonly award: AwardUseCase,
  ) {}

  async getCeremonies(): Promise<Ceremony[]> {
    return this.ceremony.findAll();
  }

  async getCeremony(year: number): Promise<Ceremony> {
    return this.ceremony.find(year);
  }

  async getNominations(year: number, department: Department): Promise<Work[]> {
    const c = await this.ceremony.find(year);
    validateDepartment(c, department);
    return await this.worksSet.get(year, department);
  }

  async addNomination(year: number, department: Department, workName: string): Promise<Work[]> {
    const c = await this.ceremony.getInStages(year, Stage.Nomination);
    validateDepartment(c, department);
    const ws = await this.worksSet.get(year, department);
    addWorkToSet(ws, workName);
    await this.worksSet.save(year, department, ws);
    return ws;
  }

  async getLoggedVoter(): Promise<Voter | undefined> {
    const c = await this.ceremony.current();
    if (getStage(c, new Date()) !== Stage.Voting) {
      return undefined;
    }
    const sessionid = cookies().get('sessionid')?.value;
    if (!sessionid) {
      return undefined;
    }
    try {
      return await this.voter.ensureAuth(c.year, sessionid);
    } catch (e) {
      const te = Terror.handleError(e);
      if (te.code === ErrorCode.NotFound) {
        return undefined;
      } else {
        throw e;
      }
    }
  }

  async requireLoggedVoter(): Promise<Voter> {
    const c = await this.ceremony.current();
    await this.ceremony.getInStages(c.year, Stage.Voting);
    const sessionid = cookies().get('sessionid')?.value;
    if (!sessionid) {
      throw NoSessionIDError();
    }
    return await this.voter.ensureAuth(c.year, sessionid);
  }

  async signUpVoter(name: string): Promise<SignUpReply> {
    const c = await this.ceremony.current();
    await this.ceremony.getInStages(c.year, Stage.Voting);
    return await this.voter.signUp(c.year, name);
  }

  async logInVoter(name: string, pinCode: string): Promise<[Voter, string]> {
    const c = await this.ceremony.current();
    await this.ceremony.getInStages(c.year, Stage.Voting);
    const voter = await this.voter.login(c.year, name, pinCode);
    const sessionid = await this.voter.makeSession(c.year, voter);
    return [voter, sessionid];
  }

  async getBallot(year: number, department: Department): Promise<Ballot> {
    const c = await this.ceremony.getInStages(year, Stage.Voting);
    validateDepartment(c, department);
    const voter = await this.requireLoggedVoter();
    try {
      return await this.ballot.getBallot(year, voter, department);
    } catch (e) {
      const te = Terror.handleError(e);
      if (te.code === ErrorCode.NotFound) {
        return {
          voter,
          rankings: [],
        };
      } else {
        throw e;
      }
    }
  }

  async editBallot(year: number, department: Department, rankingNames: RankedWorkName[]): Promise<Ballot> {
    const c = await this.ceremony.getInStages(year, Stage.Voting);
    validateDepartment(c, department);
    const voter = await this.requireLoggedVoter();
    const worksSet = await this.worksSet.get(year, department);
    const rankings = makeRankingsFromNames(rankingNames, worksSet);

    return await this.ballot.putBallot(year, department, { voter, rankings });
  }

  async getAward(year: number, department: Department): Promise<Award> {
    const c = await this.ceremony.getInStages(year, Stage.Award);
    validateDepartment(c, department);
    return await this.award.getAward(year, department);
  }
}
