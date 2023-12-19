import type { RankedWork } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import type { AwardLayoutData } from '../+layout.server';

export interface AwardDetailData {
  department: Department;
  rankedWorks: RankedWork[];
}

interface LoadParams {
  params: { dept: Department };
  parent: () => Promise<AwardLayoutData>;
}

export async function load({ params, parent }: LoadParams): Promise<AwardDetailData> {
  const parentData = await parent();
  return {
    department: params.dept,
    rankedWorks: parentData.winningsByDept.get(params.dept)!, // TODO: 404
  };
}
