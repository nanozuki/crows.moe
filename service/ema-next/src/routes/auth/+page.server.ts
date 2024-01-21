import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export interface AuthActionReturn {
  success?: boolean;
  username?: string;
  errors?: { username?: string; password?: string; passwordEnsure?: string };
}

export const actions = {
  default: async ({ request, url }) => {
    const data = await request.formData();
    const username = data.get('username');
    if (typeof username !== 'string') {
      return fail(400, { errors: { username: '不能为空' } });
    } else if (!username || username.length === 0) {
      return fail(400, { username: username, errors: { username: '不能为空' } });
    }

    let query = '?username=' + encodeURIComponent(username);
    if (url.searchParams.has('redirect')) {
      query += '&redirect=' + encodeURIComponent(url.searchParams.get('redirect')!);
    }
    const voter = await getService().getUserByName(username);
    if (!voter) {
      throw redirect(302, '/auth/sign_up' + query);
    } else if (!voter.hasPassword) {
      throw redirect(302, '/auth/set_password' + query);
    } else {
      throw redirect(302, '/auth/login' + query);
    }
  },
} satisfies Actions;
