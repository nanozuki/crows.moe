import { Voter, Year } from '@service/entity';
import { Stage, stageCNString } from '@service/value';

export interface YearView {
  year: number;
  stage: Stage;
  stageCNString: string;
  nominationRange: string;
  votingRange: string;
  defaultPage?: string;
}
const dataString = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

export function makeYearView(y: Year, voter?: Voter): YearView {
  const stage = y.stageAt(new Date());
  const view: YearView = {
    year: y.year,
    stage,
    stageCNString: stageCNString(stage),
    nominationRange: `${dataString(y.nominationStartAt)} - ${dataString(y.votingStartAt)}`,
    votingRange: `${dataString(y.votingStartAt)} - ${dataString(y.awardStartAt)}`,
  };
  switch (stage) {
    case Stage.Nomination:
      view.defaultPage = `/${y.year}/nomination/${y.departments[0]}`;
      break;
    case Stage.Voting:
      if (voter) {
        view.defaultPage = `/${y.year}/voting/${y.departments[0]}`;
      } else {
        view.defaultPage = `/${y.year}/voting/start`;
      }
      break;
    case Stage.Award:
      view.defaultPage = `/${y.year}/award/${y.departments[0]}`;
  }
  return view;
}
