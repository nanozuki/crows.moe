export interface ErrorResponse {
  code: string;
  message: string;
  origin: string;
}

export interface Year {
  year: number;
  nomination_start_at: number;
  voting_start_at: number;
  award_start_at: number;
}

export interface Department {
  dept: DepartmentName;
  works?: Work[];
}

export const enum DepartmentName {
  Anime = 'anime',
  MangaAndNovel = 'manga-novel',
  Game = 'game',
}

export const enum Stage {
  Preparation = 'Preparation',
  Nomination = 'Nomination',
  Voting = 'Voting',
  Award = 'Award',
}

export function departmentNameIsValid(dept: DepartmentName): boolean {
  return (
    dept == DepartmentName.Anime ||
    dept == DepartmentName.MangaAndNovel ||
    dept == DepartmentName.Game
  );
}

export interface Work {
  name: string;
  origin_name?: string;
  alias?: string[];
}

export interface NewVoter {
  name: string;
  pin_code: string;
}

export interface Ballot {
  rankings?: RankingItem[];
}

export interface RankingItem {
  ranking: number;
  work_name: string;
}
