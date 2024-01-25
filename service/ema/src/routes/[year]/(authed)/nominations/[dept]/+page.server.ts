import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getService } from '$lib/server';
import { parseDepartment } from '$lib/domain/entity';
import { Err } from '$lib/domain/errors';
import { P, match } from 'ts-pattern';

export async function load({ params, parent }) {
  const pd = await parent();
  const service = getService();
  const department = parseDepartment(pd.ceremony, params.dept);
  return {
    department,
    noms: await service.getWorksInDept(pd.ceremony.year, department),
  };
}

type NominationForm = { workName: string } | { workName?: string; errors: { workName: string } };

function parseForm(data: FormData): NominationForm {
  return match(data.get('workName'))
    .with(P.string.minLength(1), (workName) => ({ workName }))
    .with(P._, () => ({ errors: { workName: '不能为空' } }))
    .exhaustive();
}

export const actions = {
  default: async ({ request, params }) => {
    const { year, dept: department } = params;
    const data = await request.formData();
    const form = parseForm(data);
    if ('errors' in form) {
      return fail(400, form);
    }
    const service = getService();
    return (await Err.match(() => service.addNomination(year, department, form.workName)))
      .with({ ok: true, value: P._ }, () => {})
      .with({ ok: false, error: P.select() }, (error) => {
        const response: NominationForm = { ...form, errors: { workName: error.body.message } };
        return fail(400, response);
      })
      .exhaustive();
  },
} satisfies Actions;
