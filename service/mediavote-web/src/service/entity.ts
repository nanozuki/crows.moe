import {
  Department,
  RankedWork,
  RankedWorkName,
  Stage,
  Work,
  isWork,
} from "@service/value";
import { NoDepartmentError, WorkNotFoundError } from "@service/errors";

export class Year {
  constructor(
    public year: number,
    public departments: Department[],
    public nomination_start_at: Date,
    public voting_start_at: Date,
    public award_start_at: Date,
  ) {}

  stageAt(time: Date): Stage {
    if (time < this.nomination_start_at) {
      return Stage.Preparation;
    } else if (time < this.voting_start_at) {
      return Stage.Nomination;
    } else if (time < this.award_start_at) {
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
    private pinCode: string,
  ) {}

  validatePinCode(pinCode: string): boolean {
    return this.pinCode === pinCode;
  }
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
      const work = input.worksSet.works.find(
        (work) => work.name === rankedWorkName.workName,
      );
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
