import { cookies } from 'next/headers';
import { getCurrentYear, getVoterName } from './apis';
import { DepartmentName, Stage, Year } from './models';

interface YearInfo {
  year: number;
  stage: Stage;
  stageName: string;
  nominationRange: string;
  votingRange: string;
  voter?: string;
  redirectTo: string;
}

export async function getYearInfo(year: Year): Promise<YearInfo> {
  if (!year) {
    year = await getCurrentYear();
  }
  const stage = getStage(year);
  const voter = await getVoterName({
    sessionid: cookies().get('sessionid')?.value,
  });
  return {
    year: year.year,
    stage,
    stageName: getStageName(stage),
    nominationRange: getStageTimeRange(year, Stage.Nomination),
    votingRange: getStageTimeRange(year, Stage.Voting),
    voter: voter,
    redirectTo: await getRedirectUrlByStage(year, stage, voter),
  };
}

function getStage(year: Year): Stage {
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

function getStageName(stage: Stage): string {
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

function getStageTimeRange(year: Year, stage: Stage): string {
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

async function getRedirectUrlByStage(
  year: Year,
  stage: Stage,
  voter?: string
): Promise<string> {
  if (stage === Stage.Nomination) {
    return `/${year.year}/nomination/${DepartmentName.Anime}`;
  } else if (stage === Stage.Voting) {
    if (voter) {
      return `/${year.year}/voting/${DepartmentName.Anime}`;
    } else {
      return `/${year.year}/voting/start`;
    }
  } else {
    return `/${year.year}/award`;
  }
}
