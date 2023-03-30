import { getVoterName } from './apis';
import { DepartmentName, Stage, Year } from './models';

export function getStage(year: Year): Stage {
  const now = Date.now();
  if (now < year.nomination_start_at) {
    return Stage.Preparation;
  } else if (now < year.voting_start_at) {
    return Stage.Nomination;
  } else if (now < year.award_start_at) {
    return Stage.Voting;
  } else {
    return Stage.Award;
  }
}

export function getStageName(stage: Stage): string {
  if (stage === Stage.Preparation) {
    return '准备阶段';
  } else if (stage === Stage.Nomination) {
    return '作品提名';
  } else if (stage === Stage.Voting) {
    return '作品投票';
  } else {
    return '获奖作品';
  }
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

export function getStageTimeRange(year: Year): string {
  const stage = getStage(year);
  switch (stage) {
    case Stage.Nomination:
      return `${formatDate(year.nomination_start_at)} - ${formatDate(
        year.voting_start_at
      )}`;
    case Stage.Voting:
      return `${formatDate(year.voting_start_at)} - ${formatDate(
        year.award_start_at
      )}`;
    default:
      return '';
  }
}

export async function getRedirectUrlByStage(year: Year): Promise<string> {
  const stage = getStage(year);
  if (stage === Stage.Nomination) {
    return `/${year.year}/nomination/${DepartmentName.Anime}`;
  } else if (stage === Stage.Voting) {
    const voter = await getVoterName();
    if (voter) {
      return `/${year.year}/voting/${DepartmentName.Anime}`;
    } else {
      return `/${year.year}/voting/start`;
    }
  } else {
    return `/${year.year}/award`;
  }
}
