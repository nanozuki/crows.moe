import type { Ceremony, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import { getService } from '$lib/server';
import type { RootLayoutData } from '../../../+layout.server';
import type { Actions, RouteParams } from './$types';

export interface NomPageData {
  ceremony: Ceremony;
  department: Department;
  noms: Work[];
}

interface LoadParams {
  params: RouteParams;
  parent: () => Promise<RootLayoutData>;
}

export async function load({ params, parent }: LoadParams): Promise<NomPageData> {
  const year = parseInt(params.year);
  const service = getService();
  const parentData = await parent();
  return {
    ceremony: parentData.ceremonies.find((c) => c.year === year)!, // TODO: 404
    department: params.dept as Department,
    noms: await service.getWorksInDept(year, params.dept as Department),
  };
}

export interface NomActionReturn {
  success?: boolean;
  workName?: string;
  errors?: { name?: string };
}

export const actions = {
  default: async ({ request, params }): Promise<NomActionReturn> => {
    const data = await request.formData();
    const workName = data.get('workName');
    if (typeof workName !== 'string' || workName === '') {
      return { errors: { name: '不能为空' } };
    }
    const service = getService();
    await service.addNomination(parseInt(params.year), params.dept as Department, workName);
    return { success: true };
  },
} satisfies Actions;
