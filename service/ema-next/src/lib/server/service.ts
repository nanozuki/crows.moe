import type { Ceremony, Work, AwardRank, Voter } from '$lib/domain/entity';
import type { CeremonyRepository, VoteRepository, VoterRepository, WorkRepository } from '$lib/server/adapter';
import type { Cookies } from '@sveltejs/kit';
import type { Department } from '$lib/domain/value';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';
import { newAwardRank } from '$lib/domain/entity';
import { z } from 'zod';

const tokenOptions = {
  name: 'token',
  invitedName: 'invited',
  issuer: 'https://crows.moe',
  audience: 'https://ema.crows.moe',
  expireTime: 1000 * 60 * 60 * 24 * 30, // 30 days
};

const jwtPayloadSchema = z.object({
  id: z.number().gt(0),
  name: z.string().min(1),
  hasPassword: z.boolean(),
});

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

  async addNomination(year: number, department: Department, workName: string): Promise<void> {
    return await this.workRepository.addNomination(year, department, workName);
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
    return await this.voterRepository.getVoterByName(username);
  }

  async newCookie(cookies: Cookies, from: Date, voter: Voter): Promise<void> {
    const jwtSecret = new TextEncoder().encode(env.EMA_JWT_SECRET);
    const expires = new Date(from.getTime() + tokenOptions.expireTime);
    const jwt = await new SignJWT({ voter })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(tokenOptions.issuer)
      .setAudience(tokenOptions.audience)
      .setExpirationTime(expires)
      .sign(jwtSecret);
    cookies.set(tokenOptions.name, jwt, {
      path: '/',
      expires,
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  async newInvitedCookie(cookies: Cookies, from: Date): Promise<void> {
    const jwtSecret = new TextEncoder().encode(env.EMA_JWT_SECRET);
    const expires = new Date(from.getTime() + tokenOptions.expireTime);
    const jwt = await new SignJWT({ invited: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(tokenOptions.issuer)
      .setAudience(tokenOptions.audience)
      .setExpirationTime(expires)
      .sign(jwtSecret);
    cookies.set(tokenOptions.invitedName, jwt, {
      path: '/',
      expires,
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  async verifyToken(cookies: Cookies): Promise<Voter | undefined> {
    const jwtSecret = new TextEncoder().encode(env.EMA_JWT_SECRET);
    const token = cookies.get(tokenOptions.name);
    if (!token) {
      return undefined;
    }
    try {
      const { payload } = await jwtVerify(token, jwtSecret, {
        issuer: tokenOptions.issuer,
        audience: tokenOptions.audience,
        requiredClaims: ['iss', 'aud', 'exp', 'iat', 'voter'],
      });
      const validate = jwtPayloadSchema.safeParse(payload.voter);
      if (!validate.success) {
        return undefined;
      }
      return payload.voter as Voter;
    } catch (e) {
      return undefined;
    }
  }

  async verifyInvited(cookies: Cookies): Promise<boolean> {
    const jwtSecret = new TextEncoder().encode(env.EMA_JWT_SECRET);
    const token = cookies.get(tokenOptions.invitedName);
    if (!token) {
      return false;
    }
    try {
      const { payload } = await jwtVerify(token, jwtSecret, {
        issuer: tokenOptions.issuer,
        audience: tokenOptions.audience,
        requiredClaims: ['iss', 'aud', 'exp', 'iat', 'invited'],
      });
      return payload.invited === true;
    } catch (e) {
      return false;
    }
  }

  async logInVoter(name: string, password: string, cookies: Cookies): Promise<Voter | undefined> {
    const voter = await this.voterRepository.verifyPassword(name, password);
    if (!voter) {
      return undefined;
    }
    await this.newCookie(cookies, new Date(), voter);
    return voter;
  }

  async setPassword(name: string, password: string, cookies: Cookies): Promise<Voter> {
    const voter = await this.voterRepository.setPassword(name, password);
    await this.newCookie(cookies, new Date(), voter);
    return voter;
  }

  async signUpVoter(name: string, password: string, cookies: Cookies): Promise<Voter> {
    const voter = await this.voterRepository.createVoter(name, password);
    await this.newCookie(cookies, new Date(), voter);
    return voter;
  }

  async getVote(year: number, department: Department, voter: Voter): Promise<Work[]> {
    const vote = await this.voteRepository.getVote(year, department, voter.id);
    if (!vote) {
      return [];
    }
    return vote.rankings;
  }

  async setVote(year: number, department: Department, voter: Voter, rankingIds: Map<number, number>): Promise<void> {
    const rankings = await Promise.all(
      Array.from(rankingIds.entries(), async ([workId, ranking]) => ({
        ...(await this.workRepository.getById(workId))!,
        ranking,
      })),
    );
    return await this.voteRepository.setVote(year, department, voter.id, rankings);
  }
}

