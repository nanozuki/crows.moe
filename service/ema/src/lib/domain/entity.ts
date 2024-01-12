import { NoDepartmentError } from '$lib/domain/errors';
import { Department, Stage } from '$lib/domain/value';

// Ceremony store the ceremony information of a year
export interface Ceremony {
  year: number;
  departments: Department[];
  nominationStartAt: Date;
  votingStartAt: Date;
  awardStartAt: Date;
}

export function getStage(c: Ceremony, time: Date): Stage {
  if (time < c.nominationStartAt) {
    return Stage.Preparation;
  } else if (time < c.votingStartAt) {
    return Stage.Nomination;
  } else if (time < c.awardStartAt) {
    return Stage.Voting;
  } else {
    return Stage.Award;
  }
}

export const dataString = (date: Date): string =>
  `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;

const awardHighlightDuration = 1000 * 60 * 60 * 24 * 30; // 30 days

export function isCeremonyActive(c: Ceremony, time: Date): boolean {
  return time.getTime() - c.awardStartAt.getTime() < awardHighlightDuration;
}

export function validateDepartment(c: Ceremony, department: Department): void {
  if (!c.departments.includes(department)) {
    throw NoDepartmentError(department);
  }
}

export interface Work {
  id: number;
  year: number;
  department: Department;
  name: string;
  originName: string;
  aliases: string[];
  ranking?: number;
}

export function subnamesOfWork(w: Work): string[] {
  const subnames: string[] = [];
  if (w.originName !== w.name) {
    subnames.push(w.originName);
  }
  for (const alias of w.aliases) {
    subnames.push(alias);
  }
  return subnames;
}

export interface RankedWork {
  ranking: number;
  works: Work[];
}

export function newRankedWorks(sortedWorks: Work[]): RankedWork[] {
  const rw: RankedWork[] = [];
  const addWork = (work: Work) => {
    for (const r of rw) {
      if (r.ranking == work.ranking) {
        r.works.push(work);
        return;
      }
    }
    if (work.ranking) {
      rw.push({ ranking: work.ranking, works: [work] });
    }
  };
  for (const work of sortedWorks) {
    addWork(work);
  }
  return rw;
}

export interface Voter {
  id: number;
  name: string;
  hasPassword: boolean;
}

// hashPassword hashes the password with salt and returns 16-bit string
export async function hashPassword(password: string, salt: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + password));
  const bytes = new Uint8Array(hash);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// verifyPassword verifies the password with salt and hash
export async function verifyPassword(password: string, salt: string, hash: string): Promise<boolean> {
  return hash === (await hashPassword(password, salt));
}

export interface Vote {
  id: number;
  year: number;
  voterId: number;
  department: Department;
  rankings: Record<number, number>; // ranking -> workId
}
