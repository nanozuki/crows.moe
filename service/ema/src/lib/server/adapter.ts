import type { Ceremony, Vote, Voter, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';

export interface CeremonyRepository {
  getCeremonies(): Promise<Ceremony[]>;
  getByYear(year: number): Promise<Ceremony>;
}

export interface WorkRepository {
  getAllWinners(): Promise<Map<number, Work[]>>; // year -> work[]
  getAwardsByYear(year: number): Promise<Map<Department, Work[]>>;
  getWorksInDept(year: number, department: Department): Promise<Work[]>;
  getById(id: number): Promise<Work | undefined>;
  addNomination(year: number, department: Department, workName: string): Promise<void>;
}

export interface VoterRepository {
  findVoter(name: string): Promise<Voter | undefined>;
  createVoter(name: string, password: string): Promise<Voter>;
  setPassword(name: string, password: string): Promise<Voter>;
  verifyPassword(name: string, password: string): Promise<Voter | undefined>;
}

export interface VoteItem {
  voteId: number;
  workId: number;
  ranking: number;
}

export interface RankResultItem {
  workId: number;
  ranking: number;
}

export interface VoteRepository {
  getVote(year: number, department: Department, voterId: number): Promise<Vote | undefined>;
  setVote(year: number, department: Department, voterId: number, rankings: Work[]): Promise<void>;
  getVotes(year: number, department: Department): Promise<VoteItem[]>;
}

export interface RankCalculator {
  calculate(items: VoteItem[]): Promise<RankResultItem[]>;
}
