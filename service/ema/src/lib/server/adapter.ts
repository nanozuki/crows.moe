import type { Ceremony, Work } from '$lib/domain/entity';

export interface CeremonyRepository {
  getCeremonies(): Promise<Ceremony[]>;
}

export interface WorkRepository {
  getAllWinners(): Promise<Map<number, Work[]>>; // year -> work[]
}
