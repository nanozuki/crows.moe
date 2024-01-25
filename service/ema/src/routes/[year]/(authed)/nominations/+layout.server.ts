import type { LayoutServerLoad } from './$types';
import { Stage } from '$lib/domain/value';
import { ensureStage } from '$lib/domain/entity';

export const load: LayoutServerLoad = async ({ parent }) => {
  const pd = await parent();
  ensureStage(pd.ceremony, Stage.Nomination, pd.now);
  return {};
};
