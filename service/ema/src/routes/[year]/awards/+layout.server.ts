import { getService } from '$lib/server/index.js';

export async function load({ parent }) {
  const service = getService();
  const pd = await parent();
  return {
    winnersByDept: await service.getWinningWorks(pd.ceremony.year),
  };
}
