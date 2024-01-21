import type { Work } from '$lib/domain/entity';
import { getService } from '$lib/server';

export interface HomePageData {
  bestWorks: Map<number, Work[]>;
}

export async function load(): Promise<HomePageData> {
  const service = getService();
  return {
    bestWorks: await service.getBestWorks(),
  };
}
