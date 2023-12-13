import type { Ceremony, Work } from '$lib/domain/entity';
import { getService } from '$lib/server';

export interface HomePageData {
  ceremonies: Ceremony[];
  winners: Map<number, Work[]>;
  now: Date;
}

export async function load(): Promise<HomePageData> {
  const service = getService();
  return {
    ceremonies: await service.getCeremonies(),
    winners: await service.getWinners(),
    now: new Date(),
  };
}
