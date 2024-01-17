import type { Ceremony, Vote, VoteRank, Voter, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';

export interface CeremonyRepository {
  getCeremonies(): Promise<Ceremony[]>;
}

export interface WorkRepository {
  getAllWinners(): Promise<Map<number, Work[]>>; // year -> work[]
  getAwardsByYear(year: number): Promise<Map<Department, Work[]>>;
  getWorksInDept(year: number, department: Department): Promise<Work[]>;
  getById(id: number): Promise<Work | undefined>;
  addNomination(year: number, department: Department, workName: string): Promise<void>;
}

export interface VoterRepository {
  getVoterByName(name: string): Promise<Voter | undefined>;
  createVoter(name: string, password: string): Promise<Voter>;
  setPassword(name: string, password: string): Promise<Voter>;
  verifyPassword(name: string, password: string): Promise<Voter | undefined>;
}

export interface VoteRepository {
  getVote(year: number, department: Department, voterId: number): Promise<Vote | undefined>;
  setVote(year: number, department: Department, voterId: number, rankings: VoteRank[]): Promise<void>;
}
