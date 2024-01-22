import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

type AuthForm = { username: string } | { username?: string; errors: { username?: string } };

function parseForm(data: FormData): AuthForm {
  const username = data.get('username');
  if (typeof username !== 'string') {
    return { errors: { username: '必须是字符串' } };
  } else if (username === '') {
    return { errors: { username: '不能为空' } };
  }
  return { username };
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
    const voter = await getService().getUserByName(form.username);
    if (!voter) {
      throw redirect(302, '/auth/sign_up' + query);
    } else if (!voter.hasPassword) {
      throw redirect(302, '/auth/set_password' + query);
    } else {
      throw redirect(302, '/auth/login' + query);
    }
  },
} satisfies Actions;
