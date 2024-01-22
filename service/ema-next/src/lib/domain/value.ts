export const enum Department {
  Anime = 'anime',
  MangaAndNovel = 'manga-novel',
  Game = 'game',

  // legacy category
  TVAnime = 'tv-anime',
  NonTVAnime = 'non-tv-anime',
  Manga = 'manga',
  Novel = 'novel',
}

export const orderedDepartments = [
  Department.TVAnime,
  Department.NonTVAnime,
  Department.Anime,
  Department.Manga,
  Department.MangaAndNovel,
  Department.Game,
  Department.Novel,
];

export function parseDepartment(d: string): Department | undefined {
  if (orderedDepartments.includes(d as Department)) {
    return d as Department;
  }
}

export const enum Stage {
  Preparation = 'Preparation',
  Nomination = 'Nomination',
  Voting = 'Voting',
  Award = 'Award',
}
