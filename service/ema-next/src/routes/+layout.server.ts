import type { Ceremony } from '$lib/domain/entity';
import { getService } from '$lib/server';

export interface RootLayoutData {
  now: Date;
  ceremonies: Ceremony[];
}

export async function load(): Promise<RootLayoutData> {
  const service = getService();
  return {
    now: new Date(),
    ceremonies: await service.getCeremonies(),
  };
}
