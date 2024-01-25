import type { Ceremony, Work, AwardRank, Voter } from '$lib/domain/entity';
import type { CeremonyRepository, VoteRepository, VoterRepository, WorkRepository } from '$lib/server/adapter';
import { Err } from '$lib/domain/errors';
import { Stage, type Department } from '$lib/domain/value';
import { getStage, newAwardRank, parseDepartment } from '$lib/domain/entity';
import { redirect, type Cookies } from '@sveltejs/kit';
import { token } from '$lib/server/token';
import { z } from 'zod';

const tokens = {
  voter: token<{ voter: Voter }>(
    'token',
    z.object({
      voter: z.object({
        id: z.number().gt(0),
        name: z.string().min(1),
        hasPassword: z.boolean(),
      }),
    }),
  ),
  invited: token<{ invited: boolean }>('invited', z.object({ invited: z.boolean() })),
};

export class Service {
  constructor(
    private ceremonyRepository: CeremonyRepository,
    private workRepository: WorkRepository,
    private voterRepository: VoterRepository,
    private voteRepository: VoteRepository,
  ) {}

  async getCeremonies(): Promise<Ceremony[]> {
    return await this.ceremonyRepository.getCeremonies();
  }

  async getWorksInDept(year: number, department: Department): Promise<Work[]> {
    return await this.workRepository.getWorksInDept(year, department);
  }

  async addNomination(year: string, dept: string, workName: string): Promise<void> {
    const ceremony = await this.ceremonyRepository.getByYear(parseInt(year));
    const department = parseDepartment(ceremony, dept);
    return await this.workRepository.addNomination(ceremony.year, department as Department, workName);
  }

  async getBestWorks(): Promise<Map<number, Work[]>> {
    return await this.workRepository.getAllWinners();
  }

  async getWinningWorks(year: number): Promise<Map<Department, AwardRank[]>> {
    const winnings = await this.workRepository.getAwardsByYear(year);
    const rankedWinnings = new Map<Department, AwardRank[]>();
    for (const [department, works] of winnings.entries()) {
      rankedWinnings.set(department, newAwardRank(works));
    }
    return rankedWinnings;
  }

  async getUserByName(username: string): Promise<Voter | undefined> {
    return await this.voterRepository.findVoter(username);
  }

  async setVoterToken(cookies: Cookies, from: Date, voter: Voter): Promise<void> {
    tokens.voter.setToCookie(from, cookies, { voter });
  }

  async setInvitedToken(cookies: Cookies, from: Date): Promise<void> {
    tokens.invited.setToCookie(from, cookies, { invited: true });
  }

  async getVoterToken(cookies: Cookies): Promise<Voter | undefined> {
    const payload = await tokens.voter.getFromCookie(cookies);
    return payload?.voter;
  }

  async getInvitedToken(cookies: Cookies): Promise<boolean> {
    const payload = await tokens.invited.getFromCookie(cookies);
    return payload?.invited || false;
  }

  async logInVoter(name: string, password: string, cookies: Cookies): Promise<Voter | undefined> {
    const voter = await this.voterRepository.verifyPassword(name, password);
    if (!voter) {
      return undefined;
    }
    await this.setVoterToken(cookies, new Date(), voter);
    return voter;
  }

  async setPassword(name: string, password: string, cookies: Cookies): Promise<Voter> {
    const voter = await this.voterRepository.setPassword(name, password);
    await this.setVoterToken(cookies, new Date(), voter);
    return voter;
  }

  async signUpVoter(name: string, password: string, cookies: Cookies): Promise<Voter> {
    const voter = await this.voterRepository.createVoter(name, password);
    await this.setVoterToken(cookies, new Date(), voter);
    return voter;
  }

  async getVote(year: number, department: Department, voter: Voter): Promise<Work[]> {
    const vote = await this.voteRepository.getVote(year, department, voter.id);
    if (!vote) {
      return [];
    }
    return vote.rankings;
  }

  async setVote(cookies: Cookies, year: string, dept: string, rankingIds: Map<number, number>): Promise<void> {
    const ceremony = await this.ceremonyRepository.getByYear(parseInt(year));
    const department = parseDepartment(ceremony, dept);
    const voter = await this.getVoterToken(cookies);
    if (!voter) {
      throw Err.NotFound('voter', 'cookie');
    }
    const rankings = await Promise.all(
      Array.from(rankingIds.entries(), async ([workId, ranking]) => ({
        ...(await this.workRepository.getById(workId))!,
        ranking,
      })),
    );
    return await this.voteRepository.setVote(ceremony.year, department as Department, voter.id, rankings);
  }
}
