import { AwardUseCase, BallotUseCase, VoterUseCase, WorksSetUseCase, CeremonyUseCase } from '@service/use_case';
import { Award, Ballot, Voter, Ceremony } from '@service/entity';
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
    const y = await this.ceremony.getInStage(year, Stage.Nomination);
    y.validateDepartment(department);
    const ws = await this.worksSet.get(year, department);
    return ws.works;
  }

  async addNomination(year: number, department: Department, workName: string): Promise<Work[]> {
    const y = await this.ceremony.getInStage(year, Stage.Nomination);
    y.validateDepartment(department);
    const ws = await this.worksSet.get(year, department);
    ws.addWork(workName);
    await this.worksSet.save(year, department, ws);
    return ws.works;
  }

  async getLoggedVoter(): Promise<Voter | undefined> {
    const y = await this.ceremony.current();
    if (y.stageAt(new Date()) !== Stage.Voting) {
      return undefined;
    }
    const sessionid = cookies().get('sessionid')?.value;
    if (!sessionid) {
      return undefined;
    }
    try {
      return await this.voter.ensureAuth(y.year, sessionid);
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
    const y = await this.ceremony.current();
    await this.ceremony.getInStage(y.year, Stage.Voting);
    const sessionid = cookies().get('sessionid')?.value;
    if (!sessionid) {
      throw NoSessionIDError();
    }
    return await this.voter.ensureAuth(y.year, sessionid);
  }

  async signUpVoter(name: string): Promise<[Voter, string]> {
    const y = await this.ceremony.current();
    await this.ceremony.getInStage(y.year, Stage.Voting);
    const [voter, sessionid] = await this.voter.signUp(y.year, name);
    return [voter, sessionid];
  }

  async logInVoter(name: string, pinCode: string): Promise<[Voter, string]> {
    const y = await this.ceremony.current();
    await this.ceremony.getInStage(y.year, Stage.Voting);
    const voter = await this.voter.login(y.year, name, pinCode);
    const sessionid = await this.voter.makeSession(y.year, voter);
    return [voter, sessionid];
  }

  async getBallot(year: number, department: Department): Promise<Ballot> {
    const y = await this.ceremony.getInStage(year, Stage.Voting);
    y.validateDepartment(department);
    const voter = await this.requireLoggedVoter();
    return await this.ballot.getBallot(year, voter, department);
  }

  async editBallot(year: number, department: Department, rankings: RankedWorkName[]): Promise<Ballot> {
    const y = await this.ceremony.getInStage(year, Stage.Voting);
    y.validateDepartment(department);
    const voter = await this.requireLoggedVoter();
    const worksSet = await this.worksSet.get(year, department);
    return await this.ballot.putBallot({
      year,
      voter,
      department,
      worksSet,
      rankings,
    });
  }

  async getAward(year: number, department: Department): Promise<Award> {
    const y = await this.ceremony.getInStage(year, Stage.Award);
    y.validateDepartment(department);
    return await this.award.getAward(year, department);
  }
}
