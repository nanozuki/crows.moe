import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { Err } from '$lib/domain/errors';
import { P, match } from 'ts-pattern';

type AuthForm = { username: string } | { username?: string; errors: { username?: string } };

function parseForm(data: FormData): AuthForm {
  return match(data.get('username'))
    .with(P.string.minLength(1), (username) => ({ username }))
    .with(P._, () => ({ errors: { username: '不能为空' } }))
    .exhaustive();
}

export const actions = {
  default: async ({ request, url }) => {
    const data = await request.formData();
    const form = parseForm(data);
    if ('errors' in form) {
      return fail(400, form);
    }
    let query = '?username=' + encodeURIComponent(form.username);
    if (url.searchParams.has('redirect')) {
      query += '&redirect=' + encodeURIComponent(url.searchParams.get('redirect')!);
    }
    return (await Err.match(() => getService().getUserByName(form.username)))
      .with({ ok: true, value: undefined }, () => {
        redirect(302, '/auth/sign_up' + query);
      })
      .with({ ok: true, value: { hasPassword: true } }, () => {
        redirect(302, '/auth/login' + query);
      })
      .with({ ok: true, value: { hasPassword: false } }, () => {
        redirect(302, '/auth/set_password' + query);
      })
      .with({ ok: false, error: P.select() }, (error) => {
        const response: AuthForm = { ...form, errors: { username: error.body.message } };
        return fail(400, response);
      })
      .exhaustive();
  },
} satisfies Actions;
