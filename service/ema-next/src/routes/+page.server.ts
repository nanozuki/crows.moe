import { getService } from '$lib/server';

export async function load() {
  const service = getService();
  return {
    bestWorks: await service.getBestWorks(),
  };
}
