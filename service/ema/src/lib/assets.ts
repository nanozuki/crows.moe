import { Department } from '$lib/domain/value';

export const departmentTitle: Record<Department, string> = {
  [Department.Anime]: '动画部门',
  [Department.MangaAndNovel]: '漫画与文学部门',
  [Department.Game]: '电子游戏部门',
  [Department.TVAnime]: 'TV动画部门',
  [Department.NonTVAnime]: '其他动画部门',
  [Department.Manga]: '漫画部门',
  [Department.Novel]: '文学部门',
  [Department.Music]: '音乐部门',
};

export interface DepartmentInfo {
  title: string;
  introduction: string;
  reference: { description: string; url: string }[];
}

export const departmentInfo = (year: number): { [key in Department]: DepartmentInfo } => ({
  [Department.Anime]: {
    title: '动画',
    introduction:
      `范围为${year}年内发布的动画作品。` +
      '包括在电视台或者流媒体平台以剧集形式播出过的动画作品、动画电影、剧场版、蓝光、OVA、短片、广告PV等。' +
      `跨年份的作品以${year}年份内的部分来判断。也可以以中文字幕发布时间来计算。`,
    reference: [
      {
        description: `(wikipedia) ${year}年日本动画列表`,
        url: `https://zh.wikipedia.org/wiki/日本動畫列表_(${year}年)`,
      },
      { description: `(bangumi) ${year}年动画`, url: `https://bangumi.tv/anime/browser/airtime/${year}?sort=rank` },
    ],
  },
  [Department.MangaAndNovel]: {
    title: '漫画与文学',
    introduction:
      `${year}年内发表的漫画、小说、轻小说、视觉小说等以图片和文字承载的文学作品。` +
      `跨年份的作品以${year}年份内的部分来判断。也可以以中文翻译发布的时间来计算。`,
    reference: [
      {
        description: `(bangumi) ${year}年漫画`,
        url: `https://bangumi.tv/book/browser/comic/airtime/${year}?sort=rank`,
      },
      {
        description: `(bangumi) ${year}年小说`,
        url: `https://bangumi.tv/book/browser/novel/airtime/${year}?sort=rank`,
      },
    ],
  },
  [Department.Game]: {
    title: `电子游戏`,
    introduction:
      `${year}年内发行的电子游戏作品或者已经发售游戏或者网络游戏的大型资料片。` +
      `如果中文版延后发售，也可以按中文版发售时间计算。`,
    reference: [
      {
        description: `(metacritic) ${year}年游戏列表`,
        url: `https://www.metacritic.com/browse/games/score/metascore/year/all/filtered?year_selected=${year}`,
      },
      { description: `(bangumi) ${year}年游戏列表`, url: `https://bangumi.tv/game/browser/airtime/${year}?sort=rank` },
    ],
  },
  [Department.TVAnime]: {
    title: 'TV动画',
    introduction:
      `范围为${year}年内播出过的TV动画作品。` +
      '包括在电视台或者流媒体平台以剧集形式播出过的动画作品' +
      `跨年份的作品以${year}年份内的部分来判断。也可以以中文字幕发布时间来计算。`,
    reference: [
      {
        description: `(wikipedia) ${year}年日本动画列表`,
        url: `https://zh.wikipedia.org/wiki/日本動畫列表_(${year}年)`,
      },
      { description: `(bangumi) ${year}年动画`, url: `https://bangumi.tv/anime/browser/airtime/${year}?sort=rank` },
    ],
  },
  [Department.NonTVAnime]: {
    title: ' 其他动画',
    introduction:
      `范围为${year}年内发布的不以TV剧集形式播出的其他动画作品` +
      '包括但不限于动画电影、剧场版、蓝光、OVA、短片、广告PV。' +
      `跨年份的作品以${year}年份内的部分来判断。也可以以中文字幕发布时间来计算。`,
    reference: [
      {
        description: `(wikipedia) ${year}年日本动画列表`,
        url: `https://zh.wikipedia.org/wiki/日本動畫列表_(${year}年)`,
      },
      { description: `(bangumi) ${year}年动画`, url: `https://bangumi.tv/anime/browser/airtime/${year}?sort=rank` },
    ],
  },
  [Department.Manga]: {
    title: '漫画',
    introduction:
      `${year}年内发表的漫画等以图片和文字承载的文学作品。` +
      `跨年份的作品以${year}年份内的部分来判断。也可以以中文翻译发布的时间来计算。`,
    reference: [
      {
        description: `(bangumi) ${year}年漫画`,
        url: `https://bangumi.tv/book/browser/comic/airtime/${year}?sort=rank`,
      },
    ],
  },
  [Department.Novel]: {
    title: '文学',
    introduction:
      `${year}年内发表的小说、轻小说、等以文字承载的文学作品。` +
      `跨年份的作品以${year}年份内的部分来判断。也可以以中文翻译发布的时间来计算。`,
    reference: [
      {
        description: `(bangumi) ${year}年漫画`,
        url: `https://bangumi.tv/book/browser/comic/airtime/${year}?sort=rank`,
      },
    ],
  },
  [Department.Music]: {
    title: '音乐',
    introduction: `${year}年内发表的，前述动画、游戏部门范围内的作品使用的单首音乐作品。`,
    reference: [],
  },
});
