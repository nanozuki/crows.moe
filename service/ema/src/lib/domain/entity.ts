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
}

export interface Vote {
  id: number;
  year: number;
  voterId: number;
  department: Department;
  rankings: Record<number, number>; // ranking -> workId
}
