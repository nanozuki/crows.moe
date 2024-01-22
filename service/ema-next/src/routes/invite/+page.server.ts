import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import { getService } from '$lib/server';

export const load = async ({ parent, cookies, url }) => {
  const inviteKey = url.searchParams.get('key');
  if (inviteKey !== env.EMA_INVITE_KEY) {
    throw { status: 403 };
  }
  const service = getService();
  const parentData = await parent();
  await service.newInvitedCookie(cookies, parentData.now);
  throw redirect(302, '/');
};
