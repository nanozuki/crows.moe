import { getService } from '$lib/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { parseParams } from '$lib';

export async function load({ params, parent }) {
  const pd = await parent();
  const service = getService();
  const [year, dept] = parseParams(params);
  const works = await service.getVote(year, dept, pd.voter);
  works.sort((a, b) => (a.ranking || Infinity) - (b.ranking || Infinity));
  const votedWorkIds = new Set(works.map((w) => w.id));
  const allWorks = await service.getWorksInDept(year, dept);
  for (const work of allWorks) {
    if (!votedWorkIds.has(work.id)) {
      works.push({ ...work });
    }
  }
  return {
    department: dept,
    works: works,
  };
}

type VoteForm =
  | { rankings: Map<number, number> }
  | { rankings: Map<number, number>; error?: string; errors: Map<number, string> };

function parseForm(data: FormData): VoteForm {
  const rankings = new Map<number, number>();
  const errors = new Map<number, string>();
  let error: string | undefined;
  data.forEach((value: FormDataEntryValue, key: string) => {
    // entry format: <workId:number>=<ranking:number>?
    const workId = parseInt(key);
    if (isNaN(workId)) {
      error = '页面错误，请刷新重试';
      return;
    }
    if (typeof value !== 'string') {
      errors.set(workId, '排名必须是大于0的数字');
      return;
    }
    if (value === '') {
      return;
    }
    const ranking = parseInt(value);
    if (isNaN(ranking)) {
      errors.set(workId, '排名必须是大于0的数字');
      return;
    }
    rankings.set(workId, ranking);
  });
  if (error || errors.size > 0) {
    return { rankings, error, errors };
  }
  return { rankings };
}

export const actions = {
  default: async ({ cookies, request, params, url }) => {
    const data = await request.formData();
    const form = parseForm(data);
    if ('errors' in form) {
      return fail(400, form);
    }

    const [year, dept] = parseParams(params);
    const service = getService();
    const voter = await service.verifyToken(cookies);
    if (!voter) {
      const returnUrl = encodeURIComponent(url.pathname);
      throw redirect(302, `/auth?redirect=${returnUrl}`);
    }
    await service.setVote(year, dept, voter, form.rankings);
    return;
  },
} satisfies Actions;
