import {
  Head1,
  HyperLink,
  Text,
  SmallText,
  multiLine,
} from '@app/shared/article';
import { notFound } from 'next/navigation';
import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import ToNextButton from '@app/shared/ToNextButton';
import ToPrevButton from '@app/shared/ToPrevButton';
import { ReactNode } from 'react';
import NomList from './NomList';
import { DepartmentName, departmentNameIsValid } from '@app/shared/models';
import { getNominations } from '@app/shared/apis';

interface DepartmentInfo {
  title: string;
  dept: DepartmentName;
  intro: ReactNode;
}

const departments: DepartmentInfo[] = [
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

interface ToPrevDPProps {
  className?: string;
  idx: number;
}

function ToPrevDP({ className, idx }: ToPrevDPProps) {
  if (idx === 0) {
    return null;
  }
  const prev = departments[idx - 1];
  return (
    <ToPrevButton
      to={`/2022/nomination/${prev.dept}`}
      className={`${className || ''}`}
    />
  );
}

interface ToNextDPProps {
  className?: string;
  idx: number;
}

function ToNextDP({ className, idx }: ToNextDPProps) {
  if (idx === departments.length - 1) {
    return (
      <div
        className={`flex flex-row items-center bg-highlight-low text-subtle h-10 pl-8 pr-8 rounded ${className || ''}`}
      >
        <p>完成</p>
      </div>
    );
  }
  const next = departments[idx + 1];
  return (
    <ToNextButton
      className={`${className || ''}`}
      to={`/2022/nomination/${next.dept}`}
      label={`Next: ${next.title}部门`}
    />
  );
}

interface NominationPageProps {
  params: { dept: DepartmentName };
}

export default async function Page({ params }: NominationPageProps) {
  const { dept } = params;
  if (!departmentNameIsValid(dept)) {
    notFound();
  }
  const index = departments.findIndex((info) => info.dept === dept);
  const info = departments[index];
  const noms = await getNominations(dept);
  return (
    <div>
      <Title year="2022" to="/"></Title>
      <div className="mt-8 mb-8">
        <Head1>作品提名</Head1>
        <SmallText> 2023.3.22 10:00 - 2023.3.28 22:00 </SmallText>
        <Text>
          {multiLine(
            '提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。',
            '提名阶段，可以随时打开这个页面检查和提交。'
          )}
        </Text>
      </div>
      <TabLine page={index} className="mt-8 mb-8" />
      <div className="mt-8 mb-8">
        <Head1>
          {index + 1}/{departments.length}: {info.title}部门
        </Head1>
        {info.intro}
      </div>
      <NomList className="mt-8 mb-8" dept={info.dept} noms={noms} />
      <div className="flex flex-row mt-12 mb-4 gap-x-2">
        <ToPrevDP idx={index} />
        <ToNextDP idx={index} />
      </div>
      <TabLine page={index} className="mt-4 mb-4" />
    </div>
  );
}

export const dynamic = 'force-dynamic';
