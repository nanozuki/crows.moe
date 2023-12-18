import type { Work } from '$lib/domain/entity';
import { getService } from '$lib/server';

export interface HomePageData {
  winners: Map<number, Work[]>;
}

export async function load(): Promise<HomePageData> {
  const service = getService();
  return {
    winners: await service.getWinners(),
  };
}
