import type { Ceremony, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import { getService } from '$lib/server';
import type { RootLayoutData } from '../../../+layout.server';

export interface NomPageData {
  ceremony: Ceremony;
  department: Department;
  noms: Work[];
}

interface LoadParams {
  params: { year: string; dept: Department };
  parent: () => Promise<RootLayoutData>;
}

export async function load({ params, parent }: LoadParams): Promise<NomPageData> {
  const year = parseInt(params.year);
  const service = getService();
  const parentData = await parent();
  return {
    ceremony: parentData.ceremonies.find((c) => c.year === year)!, // TODO: 404
    department: params.dept,
    noms: await service.getWorksInDept(year, params.dept),
  };
}
