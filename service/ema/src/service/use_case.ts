import { Award, Ballot, Voter, WorksSet, Ceremony, getStage } from '@service/entity';
import { Department, RankedWork, Stage } from '@service/value';
import { NotInStageError } from '@service/errors';
import { SignJWT, jwtVerify } from 'jose';
import { jwtSecret } from '@service/env';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

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
  getByNameAndPin(year: number, name: string, pin: string): Promise<Voter>;
  createVoter(year: number, name: string, pin: string): Promise<Voter>;
}

export interface SignUpReply {
  voter: Voter;
  pinCode: string;
  cookie: ResponseCookie;
}

export class VoterUseCase {
  constructor(private voterRepository: VoterRepository) {}

  async login(year: number, name: string, pin: string): Promise<Voter> {
    return this.voterRepository.getByNameAndPin(year, name, pin);
  }

  async signUp(year: number, name: string): Promise<SignUpReply> {
    // generate pin from '10000' to '99999'
    const pin = Math.floor(Math.random() * 90000) + 10000;
    const voter = await this.voterRepository.createVoter(year, name, pin.toString());
    return { voter, pinCode: pin.toString(), cookie: await newCookie(new Date(), voter) };
  }
}

const tokenOptions = {
  name: 'token',
  issuer: 'https://crows.moe',
  audience: 'https://ema.crows.moe',
  expireTime: 1000 * 60 * 60 * 24 * 30, // 30 days
};

export async function newCookie(from: Date, voter: Voter): Promise<ResponseCookie> {
  const expires = new Date(from.getTime() + tokenOptions.expireTime);
  const jwt = await new SignJWT({ name: voter.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(tokenOptions.issuer)
    .setAudience(tokenOptions.audience)
    .setExpirationTime(expires)
    .sign(jwtSecret);
  return {
    name: tokenOptions.name,
    value: jwt,
    path: '/',
    expires,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  };
}

export async function verifyCookie(cookies: ReadonlyRequestCookies): Promise<Voter | null> {
  const token = cookies.get(tokenOptions.name)?.value;
  if (!token) {
    return null;
  }
  const { payload } = await jwtVerify(token, jwtSecret, {
    issuer: tokenOptions.issuer,
    audience: tokenOptions.audience,
    requiredClaims: ['iss', 'aud', 'exp', 'iat', 'name'],
  });
  return { name: payload.name as string };
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
