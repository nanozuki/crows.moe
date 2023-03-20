export interface Year {
  year: number;
  nominationStartAt: Date;
  voteStartAt: Date;
  awardStartAt: Date;
}

export const enum Stage {
  NotYet = 'NotYet',
  Nomination = 'Nomination',
  Vote = 'Vote',
  Award = 'Award',
}

export function idOfYear(year: Year): string {
  return year.year.toString();
}

export function stageOfYear(year: Year): Stage {
  const now = new Date();
  if (now < year.nominationStartAt) {
    return Stage.NotYet;
  } else if (now < year.voteStartAt) {
    return Stage.Nomination;
  } else if (now < year.awardStartAt) {
    return Stage.Vote;
  } else {
    return Stage.Award;
  }
}

export const enum Department {
  Anime = 'anime',
  Game = 'game',
  Literature = 'literature',
}

export interface Work {
  name: string; // name in Chinese
  originName?: string; // name in origin language
  alias?: string[];
}

export interface Voter {
  name: string;
  pinCode: string;
}

export interface Session {
  key: string;
  name: string;
}

export interface Ballot {
  dept: Department;
  rankings: RankingItem[];
}

export interface RankingItem {
  ranking: number;
  workName: string;
}

export interface Awards {
  dept: Department;
  rankings: RankingItem[];
}
