import type { Ceremony, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';

export interface CeremonyRepository {
  getCeremonies(): Promise<Ceremony[]>;
}

export interface WorkRepository {
  getAllWinners(): Promise<Map<number, Work[]>>; // year -> work[]
  getAwardsByYear(year: number): Promise<Map<Department, Work[]>>;
}
