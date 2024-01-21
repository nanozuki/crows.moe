import { getService } from '$lib/server';
import { redirect } from '@sveltejs/kit';

export interface AuthLayoutData {
  username?: string;
  invited: boolean;
}

export const load = async ({ cookies, url }): Promise<AuthLayoutData> => {
  const service = getService();
  const voter = await service.verifyToken(cookies);
  if (voter) {
    // already logged in
    throw redirect(302, '/');
  }
  const invited = await service.verifyInvited(cookies);
  const username = url.searchParams.get('username');
  return { username: username || undefined, invited };
};
