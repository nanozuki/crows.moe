export const enum Department {
  Anime = "Anime",
  MangaAndNovel = "MangaAndNovel",
  Game = "Game",

  // legacy category
  TVAnime = "TVAnime",
  NonTVAnime = "NonTVAnime",
  Manga = "Manga",
  Novel = "Novel",
}

export const enum Stage {
  Preparation = "Preparation",
  Nomination = "Nomination",
  Voting = "Voting",
  Award = "Award",
}

export interface Work {
  name: string;
  origin_name?: string;
  alias?: string[];
}

export function isWork(name: string, work: Work): boolean {
  return (
    work.name === name ||
    work.origin_name === name ||
    (work.alias && work.alias.includes(name)) ||
    false
  );
}

export interface RankedWork {
  ranking: number;
  work: Work;
}

export interface RankedWorkName {
  ranking: number;
  workName: string;
}
