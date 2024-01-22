import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

type LoginForm =
  | { username: string; password: string }
  | { username?: string; errors: { username?: string; password?: string } };

function parseForm(data: FormData): LoginForm {
  const username = data.get('username');
  const password = data.get('password');
  if (typeof username !== 'string') {
    return { errors: { username: '必须是字符串' } };
  } else if (username === '') {
    return { errors: { username: '不能为空' } };
  }
  if (typeof password !== 'string') {
    return { username, errors: { password: '必须是字符串' } };
  } else if (password.length < 8 || password.length > 20) {
    return { username, errors: { password: '长度必须在8到20之间' } };
  }
  return { username, password };
}

export const actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const form = parseForm(data);
    if ('errors' in form) {
      return fail(400, form);
    }
    const voter = await getService().logInVoter(form.username, form.password, cookies);
    if (!voter) {
      const response: LoginForm = { username: form.username, errors: { password: '密码错误' } };
      return fail(400, response);
    }
    if (url.searchParams.has('redirect')) {
      throw redirect(302, decodeURIComponent(url.searchParams.get('redirect')!));
    }
    throw redirect(302, '/');
  },
} satisfies Actions;
