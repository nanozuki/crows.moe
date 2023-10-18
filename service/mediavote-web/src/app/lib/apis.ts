import { Department, DepartmentName, Year, Work, ErrorResponse, NewVoter, Ballot, Award } from './models';

function url(op: string): string {
  const prefix =
    process.env.NODE_ENV === 'production'
      ? 'https://api.crows.moe/mediavote/v1'
      : 'https://api.crows.local:8000/mediavote/v1';
  return prefix + op;
}

async function call<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const opt = init || {};
  opt.credentials = 'include';
  const response = await fetch(input, opt);
  if (!response.ok) {
    const err: ErrorResponse = await response.json();
    throw Error(err.message ? `${err.code}: ${err.message}` : err.code);
  }
  const jsonResponse: T = await response.json();
  return jsonResponse;
}

export interface APIOption {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit | null;
  cache?: RequestCache;
  next?: NextFetchRequestConfig | undefined;
}

export async function getYears(): Promise<Year[]> {
  const res: { years: Year[] } = await call(url('/years'), {
    next: { revalidate: 3600 },
  });
  return res.years;
}

export async function getCurrentYear(): Promise<Year> {
  const res: Year = await call(url('/years/current'), {
    next: { revalidate: 3600 },
  });
  return res;
}

export async function getAwards(year: number): Promise<Award[]> {
  const res: { awards: Award[] } = await call(url(`/awards/${year}`), {
    next: { revalidate: 60 },
  });
  return res.awards;
}

export async function getNominations(deptName: DepartmentName): Promise<Work[]> {
  const res: Department = await call(url(`/nominations/${deptName}`), {
    cache: 'no-store',
  });
  return res.works || [];
}

export async function addNomination(arg: { deptName: DepartmentName; workName: string }): Promise<Work[]> {
  const res: Department = await call(url(`/nominations/${arg.deptName}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ work_name: arg.workName }),
    cache: 'no-store',
  });
  return res.works || [];
}

export async function getVoterName(arg: { sessionid?: string }): Promise<string | undefined> {
  const opt: RequestInit = { cache: 'no-store' };
  if (arg.sessionid) {
    opt.headers = { Cookie: `sessionid=${arg.sessionid}` };
  }
  const res: { name?: string } = await call(url('/voters'), opt);
  return res.name;
}

export async function newVoter(name: string): Promise<NewVoter> {
  const res: NewVoter = await call(url('/voters'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
    next: { revalidate: 3600 },
  });
  return res;
}

export async function loginVoter(arg: { name: string; pin: string }): Promise<void> {
  await call<{}>(url('/sessions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
    cache: 'no-store',
  });
}

export async function updateBallot(arg: { dept: DepartmentName; ballot: Ballot; sessionid?: string }): Promise<Ballot> {
  const opt: RequestInit = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg.ballot),
    cache: 'no-store',
  };
  if (arg.sessionid) {
    opt.headers = { Cookie: `sessionid=${arg.sessionid}` };
  }
  const res: Ballot = await call(url(`/voters/ballots/${arg.dept}`), opt);
  return res;
}

export async function getBallot(arg: { dept: DepartmentName; sessionid?: string }): Promise<Ballot> {
  const opt: RequestInit = { cache: 'no-store' };
  if (arg.sessionid) {
    opt.headers = { Cookie: `sessionid=${arg.sessionid}` };
  }
  const res: Ballot = await call(url(`/voters/ballots/${arg.dept}`), opt);
  return res;
}
