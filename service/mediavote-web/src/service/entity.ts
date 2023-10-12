import { Department, Stage, Work } from "@service/value";

export class Year {
  constructor(
    public year: number,
    public departments: Department[],
    public nomination_start_at: Date,
    public voting_start_at: Date,
    public award_start_at: Date,
  ) {}

  id(): string {
    return this.year.toString();
  }

  stage(time: Date): Stage {
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
}

export class WorksSet {
  constructor(
    public readonly year: number,
    public readonly name: Department,
    public works: Work[],
  ) {}

  hasWork(name: string): boolean {
    return this.works.some(
      (work) => work.name === name || work.origin_name === name,
    );
  }

  addWork(work: Work): void {
    if (!this.hasWork(work.name)) {
      this.works.push(work);
    }
  }
}
