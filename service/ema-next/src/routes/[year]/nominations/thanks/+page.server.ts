import { getService } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent, cookies }) => {
  const year = parseInt(params.year);
  const parentData = await parent();
  const ceremony = parentData.ceremonies.find((c) => c.year === year)!; // TODO: 404
  const service = getService();
  const voter = await service.verifyToken(cookies);
  if (!voter) {
    throw redirect(302, `/auth`);
  }
  return { ceremony, voter };
};
