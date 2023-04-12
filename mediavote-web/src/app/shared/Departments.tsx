import { Text, multiLine, HyperLink } from './article';
import { DepartmentName } from '@app/lib/models';
import { ReactNode } from 'react';

export interface DepartmentInfo {
  title: string;
  dept: DepartmentName;
  intro: ReactNode;
}

export const departments: DepartmentInfo[] = [
  {
    title: '动画',
    dept: DepartmentName.Anime,
    intro: (
      <Text>
        {multiLine(
          '范围为2022年内发布的动画作品。',
          '包括在电视台或者流媒体平台以剧集形式播出过的动画作品、动画电影、剧场版、蓝光、OVA、短片、广告PV等。',
          '跨年份的作品以2022年份内的部分来判断。也可以以中文字幕发布时间来计算。',
          '2022年新发布的作品列表可以参考：'
        )}
        <HyperLink
          text="(wikipedia) 2022年日本动画列表"
          href="https://zh.wikipedia.org/wiki/日本動畫列表_(2022年)"
        />
        和
        <HyperLink
          text="(bangumi) 2022年动画"
          href="https://bangumi.tv/anime/browser/airtime/2022?sort=rank"
        />
      </Text>
    ),
  },
  {
    title: '漫画与文学',
    dept: DepartmentName.MangaAndNovel,
    intro: (
      <Text>
        {multiLine(
          '2022年内发表的漫画、小说、轻小说、视觉小说等以图片和文字承载的文学作品。',
          '跨年份的作品以2022年份内的部分来判断。也可以以中文翻译发布的时间来计算。',
          '2022年新发布的作品列表可以参考：'
        )}
        <HyperLink
          text="(bangumi) 2022年漫画"
          href="https://bangumi.tv/book/browser/comic/airtime/2022?sort=rank"
        />
        和
        <HyperLink
          text="(bangumi) 2022年小说"
          href="https://bangumi.tv/book/browser/novel/airtime/2022?sort=rank"
        />
      </Text>
    ),
  },
  {
    title: '电子游戏',
    dept: DepartmentName.Game,
    intro: (
      <Text>
        {multiLine(
          '2022年内发行的电子游戏作品或者已经发售游戏或者网络游戏的大型资料片。',
          '如果中文版延后发售，也可以按中文版发售时间计算。',
          '2022年新发布的作品列表可以参考：'
        )}
        <HyperLink
          text="(metacritic) 2022年游戏列表"
          href="https://www.metacritic.com/browse/games/score/metascore/year/all/filtered?year_selected=2022"
        />
        和
        <HyperLink
          text="(bangumi) 2022年游戏列表"
          href="https://bangumi.tv/game/browser/airtime/2022?sort=rank"
        />
      </Text>
    ),
  },
];
