import { Department } from '$lib/domain/value';

export const departmentTitle: Record<Department, string> = {
  [Department.Anime]: '动画部门',
  [Department.MangaAndNovel]: '漫画与文学部门',
  [Department.Game]: '电子游戏部门',
  [Department.TVAnime]: 'TV动画部门',
  [Department.NonTVAnime]: '其他动画部门',
  [Department.Manga]: '漫画部门',
  [Department.Novel]: '文学部门',
};
