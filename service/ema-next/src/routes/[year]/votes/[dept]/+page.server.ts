import type { Ceremony, Work } from '$lib/domain/entity';
import type { Department } from '$lib/domain/value';
import { getService } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RouteParams } from './$types';

interface PageData {
  ceremony: Ceremony;
  department: Department;
  works: Work[];
}

function parseParams(params: RouteParams): [number, Department] {
  const year = parseInt(params.year);
  const dept = params.dept as Department;
  // TODO: validate
  return [year, dept];
}

export const load: PageServerLoad = async ({ params, parent, cookies }): Promise<PageData> => {
  const service = getService();
  const voter = await service.verifyToken(cookies);
  if (!voter) {
    const returnUrl = encodeURIComponent(`/${params.year}/votes/${params.dept}`);
    throw redirect(302, `/auth?redirect=${returnUrl}`);
  }
  const [year, dept] = parseParams(params);
  const parentData = await parent();
  const works = await service.getVote(year, dept, voter);
  works.sort((a, b) => (a.ranking || Infinity) - (b.ranking || Infinity));
  const votedWorkIds = new Set(works.map((w) => w.id));
  const allWorks = await service.getWorksInDept(year, dept);
  for (const work of allWorks) {
    if (!votedWorkIds.has(work.id)) {
      works.push({ ...work });
    }
  }
  return {
    ceremony: parentData.ceremonies.find((c) => c.year === year)!, // TODO: 404
    department: params.dept as Department,
    works: works,
  };
};

export interface ActionReturn {
  rankings: Map<number, number>; // workId -> ranking
  error?: string;
  errors: Map<number, string>; // workId -> error message
}

// parse form data entry
// format: <workId:number>=<ranking:number>?
function parseFormEntry(key: string, value: FormDataEntryValue, response: ActionReturn) {
  const workId = parseInt(key);
  if (isNaN(workId)) {
    response.error = '页面错误，请刷新重试';
    return;
  }
  if (typeof value !== 'string') {
    response.errors.set(workId, 'Invalid ranking');
    return;
  }
  if (value === '') {
    return;
  }
  const ranking = parseInt(value as string);
  if (isNaN(ranking)) {
    response.errors.set(workId, 'Invalid ranking');
    return;
  }
  response.rankings.set(workId, ranking);
}

export const actions = {
  default: async ({ request, params, cookies }): Promise<ActionReturn | undefined> => {
    const data = await request.formData();
    const response: ActionReturn = { rankings: new Map(), errors: new Map() };
    for (const [key, value] of data.entries()) {
      parseFormEntry(key, value, response);
    }
    if (response.rankings.size === 0) {
      return;
    } else if (response.error || response.errors.size > 0) {
      return response;
    }
    const [year, dept] = parseParams(params);
    const service = getService();
    // TODO: wrap into function and use svelte stores. {
    const voter = await service.verifyToken(cookies);
    if (!voter) {
      const returnUrl = encodeURIComponent(`/${params.year}/nominations/${params.dept}`);
      throw redirect(302, `/auth?redirect=${returnUrl}`);
    }
    // }
    await service.setVote(year, dept, voter, response.rankings);
    return;
  },
} satisfies Actions;
