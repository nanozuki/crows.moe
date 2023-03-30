import {
  Department,
  DepartmentName,
  Year,
  Work,
  ErrorResponse,
  NewVoter,
  Ballot,
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
  const res: { years: Year[] } = await call(url('/years'), {
    cache: 'no-store',
  });
  return res.years;
}

export async function getCurrentYear(): Promise<Year> {
  const res: Year = await call(url('/years/current'), {
    cache: 'no-store',
  });
  return res;
}

export async function getNominations(
  deptName: DepartmentName
): Promise<Work[]> {
  const res: Department = await call(url(`/nominations/${deptName}`), {
    cache: 'no-store',
  });
  return res.works || [];
}

export async function addNomination(
  deptName: DepartmentName,
  workName: string
): Promise<Work[]> {
  const res: Department = await call(url(`/nominations/${deptName}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ work_name: workName }),
    cache: 'no-store',
  });
  return res.works || [];
}

export async function getVoterName(): Promise<string | undefined> {
  const res: { name?: string } = await call(url('/voters'), {
    cache: 'no-store',
  });
  return res.name;
}

export async function newVoter(name: string): Promise<NewVoter> {
  const res: NewVoter = await call(url('/voters'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
    cache: 'no-store',
  });
  return res;
}

export async function loginVoter(
  name: string,
  pin_code: string
): Promise<void> {
  await call<{}>(url('/sessions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, pin_code }),
    cache: 'no-store',
  });
}

export async function updateBallot(
  dept: DepartmentName,
  ballot: Ballot
): Promise<Ballot> {
  const res: Ballot = await call(url(`/voters/ballots/${dept}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ballot),
    cache: 'no-store',
  });
  return res;
}

export async function getBallot(dept: DepartmentName): Promise<Ballot> {
  const res: Ballot = await call(url(`/voters/ballots/${dept}`), {
    cache: 'no-store',
  });
  return res;
}
