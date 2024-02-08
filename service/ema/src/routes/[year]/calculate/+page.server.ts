import { getStage } from '$lib/domain/entity';
import { getService } from '$lib/server';
import { Err } from '$lib/domain/errors';
import { Stage } from '$lib/domain/value';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const pd = await parent();
  if (getStage(pd.ceremony, pd.now) !== Stage.Award) {
    throw Err.Invalid('year', pd.ceremony.year);
  }
  const service = getService();
  return {
    result: await service.calculate(pd.ceremony.year),
  };
};
