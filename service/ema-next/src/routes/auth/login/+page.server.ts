import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const username = data.get('username');
    if (typeof username !== 'string') {
      return fail(400, { errors: { username: '不能为空' } });
    } else if (!username || username.length === 0) {
      return fail(400, { username: username, errors: { username: '不能为空', password: '' } });
    }
    const password = data.get('password');
    if (typeof password !== 'string') {
      return fail(400, { username, errors: { username: '', password: '不能为空' } });
    } else if (password.length < 8 || password.length > 20) {
      return fail(400, { username, errors: { username: '', password: '长度必须在8到20之间' } });
    }
    const voter = await getService().logInVoter(username, password, cookies);
    if (!voter) {
      return fail(400, { username, errors: { password: '密码错误' } });
    }
    if (url.searchParams.has('redirect')) {
      throw redirect(302, decodeURIComponent(url.searchParams.get('redirect')!));
    }
    throw redirect(302, '/');
  },
} satisfies Actions;
