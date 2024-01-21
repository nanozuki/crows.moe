import { Department, RankedWork, RankedWorkName, Stage, Work, isWork } from '@service/value';
import { NoDepartmentError, WorkNotFoundError } from '@service/errors';

const dataString = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

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

export function validateDepartment(c: Ceremony, department: Department): void {
  if (!c.departments.includes(department)) {
    throw NoDepartmentError(department);
  }
}

export function getNominationRange(c: Ceremony): [string, string] {
  return [dataString(c.nominationStartAt), dataString(c.votingStartAt)];
}

export function getVotingRange(c: Ceremony): [string, string] {
  return [dataString(c.votingStartAt), dataString(c.awardStartAt)];
}

export type WorksSet = Work[];

export function hasWorkInSet(worksSet: WorksSet, workName: string): boolean {
  return worksSet.some((work) => isWork(workName, work));
}

export function addWorkToSet(worksSet: WorksSet, workName: string): void {
  if (!worksSet.some((work) => isWork(workName, work))) {
    worksSet.push({ name: workName });
  }
}

export interface Voter {
  name: string;
}

export interface Ballot {
  voter: Voter;
  rankings: RankedWork[];
}

export function makeRankingsFromNames(rankingNames: RankedWorkName[], works: WorksSet): RankedWork[] {
  return rankingNames.map((rn) => {
    const work = works.find((w) => isWork(rn.workName, w));
    if (!work) {
      throw WorkNotFoundError(rn.workName);
    }
    return { ranking: rn.ranking, work };
  });
}

export interface Award {
  rankings: RankedWork[];
}
