import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { Err } from '$lib/domain/errors';
import { P } from 'ts-pattern';

type LoginForm =
  | { username: string; password: string }
  | { username?: string; errors: { username?: string; password?: string } };

function parseForm(data: FormData): LoginForm {
  const username = data.get('username');
  if (typeof username !== 'string') {
    return { errors: { username: '必须是字符串' } };
  } else if (username === '') {
    return { errors: { username: '不能为空' } };
  }
  const password = data.get('password');
  if (typeof username !== 'string') {
    return { errors: { username: '必须是字符串' } };
  } else if (username === '') {
    return { errors: { username: '不能为空' } };
  }
  if (typeof password !== 'string') {
    return { username, errors: { password: '必须是字符串' } };
  } else if (password.length < 8) {
    return { username, errors: { password: '长度必须大于8' } };
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
    return (await Err.match(() => getService().logInVoter(form.username, form.password, cookies)))
      .with({ ok: true, value: undefined }, () => {
        const response: LoginForm = { ...form, errors: { password: '密码错误' } };
        return fail(400, response);
      })
      .with({ ok: true, value: P.select() }, () => {
        if (url.searchParams.has('redirect')) {
          redirect(302, decodeURIComponent(url.searchParams.get('redirect')!));
        }
        redirect(302, '/');
      })
      .with({ ok: false, error: P.select() }, (error) => {
        const response: LoginForm = { ...form, errors: { username: error.body.message } };
        return fail(400, response);
      })
      .exhaustive();
  },
} satisfies Actions;
