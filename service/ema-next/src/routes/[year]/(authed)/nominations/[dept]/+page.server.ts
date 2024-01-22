import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getService } from '$lib/server';
import { parseParams } from '$lib';

export async function load({ params }) {
  const service = getService();
  const [year, department] = parseParams(params);
  return {
    department,
    noms: await service.getWorksInDept(year, department),
  };
}

type NominationForm = { workName: string } | { workName?: string; errors: { workName: string } };

function parseForm(data: FormData): NominationForm {
  const workName = data.get('workName');
  if (typeof workName !== 'string') {
    return { errors: { workName: '必须是字符串' } };
  } else if (workName === '') {
    return { errors: { workName: '不能为空' } };
  }
  return { workName };
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
    await service.addNomination(year, department, form.workName);
  },
} satisfies Actions;
