import { Department, DepartmentName, Year, Work } from './models';

function url(op: string): string {
  const prefix =
    process.env.NODE_ENV === 'production'
      ? 'https://api.crows.moe/mediavote/v1'
      : 'http://127.0.0.1:8080/mediavote/v1';
  return prefix + op;
}

export async function getYears(): Promise<Year[]> {
  const res = await fetch(url('/years'));
  const jsonRes: { years: Year[] } = await res.json();
  return jsonRes.years;
}

export async function getCurrentYear(): Promise<Year> {
  const res = await fetch(url('/years'));
  const jsonRes: Year = await res.json();
  return jsonRes;
}

export async function getNominations(
  deptName: DepartmentName
): Promise<Work[]> {
  const res = await fetch(url(`/nominations/${deptName}`));
  const jsonRes: Department = await res.json();
  return jsonRes.works || [];
}

export async function addNomination(
  deptName: DepartmentName,
  workName: string
): Promise<Work[]> {
  const res = await fetch(url(`/nominations/${deptName}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ work_name: workName }),
  });
  const jsonRes: Department = await res.json();
  console.log('json res: ', jsonRes);
  return jsonRes.works || [];
}
