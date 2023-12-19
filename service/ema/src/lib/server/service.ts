import { newRankedWorks } from '$lib/domain/entity';
import type { Ceremony, Work, RankedWork } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import type { CeremonyRepository, WorkRepository } from '$lib/server/adapter';

export class Service {
  constructor(
    private ceremonyRepository: CeremonyRepository,
    private workRepository: WorkRepository,
  ) {}

  async getCeremonies(): Promise<Ceremony[]> {
    return await this.ceremonyRepository.getCeremonies();
  }

  async getBestWorks(): Promise<Map<number, Work[]>> {
    return await this.workRepository.getAllWinners();
  }

  async getWinningWorks(year: number): Promise<Map<Department, RankedWork[]>> {
    const winnings = await this.workRepository.getAwardsByYear(year);
    const rankedWinnings = new Map<Department, RankedWork[]>();
    for (const [department, works] of winnings.entries()) {
      rankedWinnings.set(department, newRankedWorks(works));
    }
    return rankedWinnings;
  }
}
