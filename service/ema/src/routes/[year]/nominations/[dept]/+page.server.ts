import type { Ceremony, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import { getService } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export interface NomPageData {
  ceremony: Ceremony;
  department: Department;
  noms: Work[];
}

export const load: PageServerLoad = async ({ params, parent, cookies }) => {
  const service = getService();
  const voter = await service.verifyToken(cookies);
  console.log('voter: ', voter);
  if (!voter) {
    const returnUrl = encodeURIComponent(`/${params.year}/nominations/${params.dept}`);
    throw redirect(302, `/auth?redirect=${returnUrl}`);
  }
  const year = parseInt(params.year);
  const parentData = await parent();
  return {
    ceremony: parentData.ceremonies.find((c) => c.year === year)!, // TODO: 404
    department: params.dept as Department,
    noms: await service.getWorksInDept(year, params.dept as Department),
  };
};

export interface NomActionReturn {
  success?: boolean;
  workName?: string;
  errors?: { workName?: string };
}

export const actions = {
  default: async ({ request, params }): Promise<NomActionReturn> => {
    const data = await request.formData();
    const workName = data.get('workName');
    if (typeof workName !== 'string' || workName === '') {
      return { errors: { workName: '不能为空' } };
    }
    const service = getService();
    await service.addNomination(parseInt(params.year), params.dept as Department, workName);
    return { success: true };
  },
} satisfies Actions;
