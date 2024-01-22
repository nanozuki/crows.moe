import { Department, parseDepartment } from '$lib/domain/value';
import { error } from '@sveltejs/kit';

export function parseParams(params: { year: string; dept: string }): [number, Department] {
  const year = parseInt(params.year);
  const department = parseDepartment(params.dept);
  if (isNaN(year) || !department) {
    throw error(404);
  }
  return [year, department];
}
