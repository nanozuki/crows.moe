import { cookies } from 'next/headers';
import { AwardUseCase, BallotUseCase, VoterUseCase, WorksSetUseCase, YearUseCase } from '@service/use_case';
import { Award, Ballot, Voter, Year } from '@service/entity';
import { Department, RankedWorkName, Stage, Work } from '@service/value';
import { NoSessionIDError } from '@service/errors';

export class Service {
  constructor(
    private readonly year: YearUseCase,
    private readonly worksSet: WorksSetUseCase,
    private readonly voter: VoterUseCase,
    private readonly ballot: BallotUseCase,
    private readonly award: AwardUseCase,
  ) {}

  async getYears(): Promise<Year[]> {
    return this.year.findAll();
  }

  async getYear(year: number): Promise<Year> {
    return this.year.find(year);
  }

  async getNominations(year: number, department: Department): Promise<Work[]> {
    const y = await this.year.getInStage(year, Stage.Nomination);
    y.validateDepartment(department);
    const ws = await this.worksSet.get(year, department);
    return ws.works;
  }

  async postNominations(year: number, department: Department, workName: string): Promise<void> {
    const y = await this.year.getInStage(year, Stage.Nomination);
    y.validateDepartment(department);
    const ws = await this.worksSet.get(year, department);
    ws.addWork(workName);
    await this.worksSet.save(year, department, ws);
  }

  async getLoggedVoter(year: number): Promise<Voter> {
    await this.year.getInStage(year, Stage.Voting);
    const sessionid = cookies().get('sessionid')?.value;
    if (!sessionid) {
      throw NoSessionIDError();
    }
    const voter = await this.voter.ensureAuth(year, sessionid);
    return voter;
  }

  async signUpVoter(year: number, name: string): Promise<Voter> {
    await this.year.getInStage(year, Stage.Voting);
    const [voter, sessionid] = await this.voter.signUp(year, name);
    cookies().set('sessionid', sessionid, {
      domain: 'crow.moe', // TODO: or "crows.local" for local development
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      secure: true,
      httpOnly: true,
      sameSite: 'none', // TODO: check, after combine frontend and backend
    });
    return voter;
  }

  async logInVoter(year: number, name: string, pinCode: string): Promise<void> {
    await this.year.getInStage(year, Stage.Voting);
    const voter = await this.voter.login(year, name, pinCode);
    const sessionid = await this.voter.makeSession(year, voter);
    cookies().set('sessionid', sessionid, {
      domain: 'crow.moe', // TODO: or "crows.local" for local development
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      secure: true,
      httpOnly: true,
      sameSite: 'none', // TODO: check, after combine frontend and backend
    });
  }

  async getBallot(year: number, department: Department): Promise<Ballot> {
    const y = await this.year.getInStage(year, Stage.Voting);
    y.validateDepartment(department);
    const voter = await this.getLoggedVoter(year);
    const ballot = await this.ballot.getBallot(year, voter, department);
    return ballot;
  }

  async putBallot(year: number, department: Department, rankings: RankedWorkName[]): Promise<Ballot> {
    const y = await this.year.getInStage(year, Stage.Voting);
    y.validateDepartment(department);
    const voter = await this.getLoggedVoter(year);
    const worksSet = await this.worksSet.get(year, department);
    const ballot = await this.ballot.putBallot({
      year,
      voter,
      department,
      worksSet,
      rankings,
    });
    return ballot;
  }

  async getAward(year: number, department: Department): Promise<Award> {
    const y = await this.year.getInStage(year, Stage.Award);
    y.validateDepartment(department);
    const award = await this.award.getAward(year, department);
    return award;
  }
}
