export interface Year {
  year: Number;
  nomination_start_at: Date;
  voting_start_at: Date;
  award_start_at: Date;
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

export interface ErrorResponse {
  code: string;
  message: string;
  origin: string;
}
