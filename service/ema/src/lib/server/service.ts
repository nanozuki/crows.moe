import type { Ceremony, Work } from '$lib/domain/entity';
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

  async getWinners(): Promise<Map<number, Work[]>> {
    return await this.workRepository.getAllWinners();
  }

  async getAwardsByYear(year: number): Promise<Map<Department, Work[]>> {
    return await this.workRepository.getAwardsByYear(year);
  }
}
