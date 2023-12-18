import type { Ceremony, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import { getService } from '$lib/server/index.js';
import type { RootLayoutData } from '../../+layout.server';

export interface AwardLayoutData {
  ceremony: Ceremony;
  awards: Map<Department, Work[]>;
}

interface LoadParams {
  params: { year: string };
  parent: () => Promise<RootLayoutData>;
}

export async function load({ params, parent }: LoadParams): Promise<AwardLayoutData> {
  console.log('received data from parent:', parent);
  const year = parseInt(params.year);
  const service = getService();
  const parentData = await parent();
  return {
    ceremony: parentData.ceremonies.find((c) => c.year === year)!,
    awards: await service.getAwardsByYear(year),
  };
}
