import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { Err } from '$lib/domain/errors';
import { P } from 'ts-pattern';

type SignUpForm =
  | { username: string; password: string }
  | { username?: string; errors: { username?: string; password?: string; passwordEnsure?: string } };

function parseForm(data: FormData): SignUpForm {
  const username = data.get('username');
  if (typeof username !== 'string') {
    return { errors: { username: '必须是字符串' } };
  } else if (username === '') {
    return { errors: { username: '不能为空' } };
  }
  const password = data.get('password');
  if (typeof password !== 'string') {
    return { username, errors: { password: '必须是字符串' } };
  } else if (password.length < 8) {
    return { username, errors: { password: '长度必须大于8' } };
  }
  const passwordEnsure = data.get('password_ensure');
  if (password !== passwordEnsure) {
    return { username, errors: { passwordEnsure: '两次输入不一致' } };
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
    return (await Err.match(() => getService().signUpVoter(form.username, form.password, cookies)))
      .with({ ok: true, value: P._ }, () => {
        if (url.searchParams.has('redirect')) {
          throw redirect(302, decodeURIComponent(url.searchParams.get('redirect')!));
        }
        throw redirect(302, '/');
      })
      .with({ ok: false, error: P.select() }, (error) => {
        const response: SignUpForm = { ...form, errors: { username: error.body.message } };
        return fail(400, response);
      })
      .exhaustive();
  },
} satisfies Actions;
