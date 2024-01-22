import { parseDepartment } from '$lib/domain/value';
import { error } from '@sveltejs/kit';

export async function load({ params, parent }) {
  const parentData = await parent();
  const department = parseDepartment(params.dept);
  if (!department) {
    throw error(404);
  }
  return {
    department,
    rankedWorks: parentData.winnersByDept.get(department)!,
  };
}
