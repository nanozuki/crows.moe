import type { Ceremony, Voter, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';

export interface CeremonyRepository {
  getCeremonies(): Promise<Ceremony[]>;
}

export interface WorkRepository {
  getAllWinners(): Promise<Map<number, Work[]>>; // year -> work[]
  getAwardsByYear(year: number): Promise<Map<Department, Work[]>>;
  getWorksInDept(year: number, department: Department): Promise<Work[]>;
  addNomination(year: number, department: Department, workName: string): Promise<void>;
}

export interface VoterRepository {
  getVoterByName(name: string): Promise<Voter | undefined>;
  createVoter(name: string, password: string): Promise<Voter>;
  setPassword(name: string, password: string): Promise<Voter>;
  verifyPassword(name: string, password: string): Promise<Voter | undefined>;
}
