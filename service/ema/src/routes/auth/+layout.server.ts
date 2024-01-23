import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent, url }) => {
  const pd = await parent();
  if (pd.voter) {
    // already logged in
    throw redirect(302, '/');
  }
  const username = url.searchParams.get('username');
  return { username };
};
