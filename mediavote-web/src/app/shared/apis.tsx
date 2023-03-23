import {
  Department,
  DepartmentName,
  Year,
  Work,
  ErrorResponse,
} from './models';

function url(op: string): string {
  const prefix =
    process.env.NODE_ENV === 'production'
      ? 'https://api.crows.moe/mediavote/v1'
      : 'http://127.0.0.1:8080/mediavote/v1';
  return prefix + op;
}

async function call<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const errorResponse: ErrorResponse = await response.json();
    throw Error(errorResponse.message);
  }
  const jsonResponse: T = await response.json();
  return jsonResponse;
}

export async function getYears(): Promise<Year[]> {
  const jsonRes: { years: Year[] } = await call(url('/years'), {
    cache: 'no-store',
  });
  return jsonRes.years;
}

export async function getCurrentYear(): Promise<Year> {
  const jsonRes: Year = await call(url('/years'), { cache: 'no-store' });
  return jsonRes;
}

export async function getNominations(
  deptName: DepartmentName
): Promise<Work[]> {
  const jsonRes: Department = await call(url(`/nominations/${deptName}`), {
    cache: 'no-store',
  });
  return jsonRes.works || [];
}

export async function addNomination(
  deptName: DepartmentName,
  workName: string
): Promise<Work[]> {
  const jsonRes: Department = await call(url(`/nominations/${deptName}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ work_name: workName }),
    cache: 'no-store',
  });
  return jsonRes.works || [];
}
