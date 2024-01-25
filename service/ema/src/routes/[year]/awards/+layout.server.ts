import { ensureStage } from '$lib/domain/entity';
import { Stage } from '$lib/domain/value.js';
import { getService } from '$lib/server/index.js';

export async function load({ parent }) {
  const service = getService();
  const pd = await parent();
  ensureStage(pd.ceremony, Stage.Award, pd.now);
  return {
    winnersByDept: await service.getWinningWorks(pd.ceremony.year),
  };
}
