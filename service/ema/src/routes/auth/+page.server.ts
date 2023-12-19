import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export interface AuthActionReturn {
  success?: boolean;
  username?: string;
  errors?: { username?: string; password?: string; passwordEnsure?: string };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const username = data.get('username');
    if (typeof username !== 'string') {
      return fail(400, { errors: { username: '不能为空' } });
    } else if (!username || username.length === 0) {
      return fail(400, { username: username, errors: { username: '不能为空' } });
    }

    const voter = await getService().getUserByName(username);
    if (!voter) {
      throw redirect(302, '/auth/sign_up?username=' + encodeURIComponent(username));
    } else if (!voter.hasPassword) {
      throw redirect(302, '/auth/set_password?username=' + encodeURIComponent(username));
    } else {
      throw redirect(302, '/auth/login?username=' + encodeURIComponent(username));
    }
  },
} satisfies Actions;
