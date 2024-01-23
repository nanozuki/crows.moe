import { parseDepartment } from '$lib/domain/entity.js';

export async function load({ params, parent }) {
  const pd = await parent();
  const department = parseDepartment(pd.ceremony, params.dept);
  return {
    department,
    rankedWorks: pd.winnersByDept.get(department)!,
  };
}
