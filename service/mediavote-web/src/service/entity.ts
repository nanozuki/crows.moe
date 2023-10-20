import { Department, RankedWork, RankedWorkName, Stage, Work, isWork } from '@service/value';
import { NoDepartmentError, WorkNotFoundError } from '@service/errors';

const dataString = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

// Ceremony store the ceremony information of a year
export class Ceremony {
  constructor(
    public year: number,
    public departments: Department[],
    public nominationStartAt: Date,
    public votingStartAt: Date,
    public awardStartAt: Date,
  ) {}

  stageAt(time: Date): Stage {
    if (time < this.nominationStartAt) {
      return Stage.Preparation;
    } else if (time < this.votingStartAt) {
      return Stage.Nomination;
    } else if (time < this.awardStartAt) {
      return Stage.Voting;
    } else {
      return Stage.Award;
    }
  }

  validateDepartment(department: Department): void {
    if (!this.departments.includes(department)) {
      throw NoDepartmentError(department);
    }
  }

  nominationRange(): [string, string] {
    return [dataString(this.nominationStartAt), dataString(this.votingStartAt)];
  }

  votingRange(): [string, string] {
    return [dataString(this.votingStartAt), dataString(this.awardStartAt)];
  }
}

export class WorksSet {
  constructor(
    public readonly year: number,
    public readonly name: Department,
    public works: Work[],
  ) {}

  hasWork(name: string): boolean {
    return this.works.some((work) => isWork(name, work));
  }

  addWork(workName: string): void {
    if (!this.hasWork(workName)) {
      this.works.push({ name: workName });
    }
  }
}

export class Voter {
  constructor(
    public name: string,
    public pinCode: string,
  ) {}
}

export interface BallotInput {
  year: number;
  voter: Voter;
  department: Department;
  worksSet: WorksSet;
  rankings: RankedWorkName[];
}

export class Ballot {
  public readonly year: number;
  public readonly department: Department;
  public readonly voter: Voter;
  public rankings: RankedWork[];

  constructor(input: BallotInput) {
    this.rankings = input.rankings.map((rankedWorkName) => {
      const work = input.worksSet.works.find((work) => work.name === rankedWorkName.workName);
      if (!work) {
        throw WorkNotFoundError(rankedWorkName.workName);
      }
      return {
        work,
        ranking: rankedWorkName.ranking,
      };
    });
    this.year = input.year;
    this.department = input.department;
    this.voter = input.voter;
  }
}

export class Award {
  constructor(
    public readonly year: number,
    public readonly department: Department,
    public rankings: RankedWork[],
  ) {}
}
