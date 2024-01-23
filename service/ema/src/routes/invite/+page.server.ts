import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import { getService } from '$lib/server';
import { Err } from '$lib/domain/errors.js';

export const load = async ({ parent, cookies, url }) => {
  const inviteKey = url.searchParams.get('key');
  if (inviteKey !== env.EMA_INVITE_KEY) {
    throw error(400, Err.Invalid('invite key', inviteKey).toError());
  }
  const service = getService();
  const parentData = await parent();
  await service.setInvitedToken(cookies, parentData.now);
  if (url.searchParams.has('redirect')) {
    throw redirect(302, decodeURIComponent(url.searchParams.get('redirect')!));
  }
  throw redirect(302, '/');
};
