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
  Preparation,
  Nomination,
  Voting,
  Award,
}

export interface Work {
  name: string;
  origin_name: string;
  alias: string[];
}
