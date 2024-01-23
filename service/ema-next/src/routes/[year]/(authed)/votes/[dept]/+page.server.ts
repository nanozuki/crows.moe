import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getService } from '$lib/server';
import { parseDepartment } from '$lib/domain/entity';
import { P, match } from 'ts-pattern';

export async function load({ params, parent }) {
  const pd = await parent();
  const department = parseDepartment(pd.ceremony, params.dept);
  const service = getService();
  const works = await service.getVote(pd.ceremony.year, department, pd.voter);
  works.sort((a, b) => (a.ranking || Infinity) - (b.ranking || Infinity));
  const votedWorkIds = new Set(works.map((w) => w.id));
  const allWorks = await service.getWorksInDept(pd.ceremony.year, department);
  for (const work of allWorks) {
    if (!votedWorkIds.has(work.id)) {
      works.push({ ...work });
    }
  }
  return {
    department,
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
    match([parseInt(key), parseInt(value as string)])
      .with([P.number.gt(0), P.number.gt(0)], ([workId, ranking]) => {
        rankings.set(workId, ranking);
      })
      .with([P.number.gt(0), P._], ([workId]) => {
        errors.set(workId, '排名必须是大于0的数字');
      })
      .with([P._, P._], () => {
        error = '页面错误，请刷新重试';
      })
      .exhaustive();
  });
  if (error || errors.size > 0) {
    return { rankings, error, errors };
  }
  return { rankings };
}

export const actions = {
  default: async ({ cookies, request, params }) => {
    const data = await request.formData();
    const form = parseForm(data);
    if ('errors' in form) {
      return fail(400, form);
    }

    const { year, dept } = params;
    const service = getService();
    await service.setVote(cookies, year, dept, form.rankings);
    return;
  },
} satisfies Actions;
