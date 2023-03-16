import { notFound } from "next/navigation";
import TabLine from "@app/shared/TabLine";
import Title from "@app/shared/Title";
import ToNextButton from "@app/shared/ToNextButton";
import ToPrevButton from "@app/shared/ToPrevButton";
import { ReactNode } from "react";
import NomList from "./NomList";
import { Department } from "@gqlgen/graphql";
import { doc } from "@gql/init";
import { srvQuery } from "@app/shared/gql";

interface DepartmentInfo {
  name: string;
  dept: Department;
  intro: ReactNode;
}

const departments: DepartmentInfo[] = [
  {
    name: "TV动画",
    dept: Department.TvAnime,
    intro: (
      <div className="text-subtle mt-1 mb-1">
        <p className="mt-1 mb-1">
          2022年内在电视台或者流媒体平台以剧集形式播出过的动画作品。跨年份的作品以2022年份内的部分来判断。
          新播出的作品可以参考：
          <a
            className="text-pine underline"
            href="https://zh.wikipedia.org/wiki/日本動畫列表_(2022年)"
          >
            2022年日本动画列表
          </a>
        </p>
      </div>
    ),
  },
  {
    name: "其他动画",
    dept: Department.NonTvAnime,
    intro: (
      <div className="text-subtle mt-1 mb-1">
        <p className="mt-1 mb-1">
          2022年内以其他形式公开的动画作品。比如剧场版、蓝光、OVA、短片、广告PV等。
          跨年份的作品以2022年份内的部分来判断。也可以以中文字幕发布时间来计算。
          新播出的作品可以参考：
          <a
            className="text-pine underline"
            href="https://zh.wikipedia.org/wiki/日本動畫列表_(2022年)"
          >
            2022年日本动画列表
          </a>
        </p>
      </div>
    ),
  },
  {
    name: "漫画",
    dept: Department.Manga,
    intro: (
      <div className="text-subtle mt-1 mb-1">
        <p className="mt-1 mb-1">
          2022年内发表的漫画作品。跨年份的作品以2022年份内的部分来判断。
        </p>
      </div>
    ),
  },
  {
    name: "电子游戏",
    dept: Department.Game,
    intro: (
      <div className="text-subtle mt-1 mb-1">
        <p className="mt-1 mb-1">
          2022年内发行的电子游戏作品或者已经发售游戏或者网络游戏的大型资料片。
          如果中文版延后发售，也可以按中文版发售时间计算。
        </p>
      </div>
    ),
  },
  {
    name: "小说",
    dept: Department.Novel,
    intro: (
      <div className="text-subtle mt-1 mb-1">
        <p className="mt-1 mb-1">
          2022年内公开的小说作品。跨年份的作品以2022年份内的部分来判断。
        </p>
      </div>
    ),
  },
];

interface ToPrevDPProps {
  className?: string;
  idx: number;
}

function ToPrevDP({ className, idx }: ToPrevDPProps) {
  if (idx === 1) {
    return null;
  }
  return (
    <ToPrevButton
      to={`/2022/nomination/${idx - 1}`}
      className={`${className}`}
    />
  );
}

interface ToNextDPProps {
  className?: string;
  idx: number;
}

function ToNextDP({ className, idx }: ToNextDPProps) {
  if (idx === 5) {
    return (
      <div
        className={`flex flex-row items-center bg-highlight-low text-subtle h-10 pl-8 pr-8 rounded ${className}`}
      >
        <p>完成</p>
      </div>
    );
  }
  return (
    <ToNextButton
      className={`${className}`}
      to={`/2022/nomination/${idx + 1}`}
      label={`Next: ${departments[idx].name}部门`}
    />
  );
}

interface NominationPageProps {
  params: { index: string };
}

export default async function Page({ params }: NominationPageProps) {
  const { index: department } = params;
  const idx = parseInt(department);
  if (isNaN(idx) || idx < 1 || idx > 5) {
    notFound();
  }

  const info = departments[idx - 1];
  const data = await srvQuery(doc.getNominations, { dept: info.dept });
  return (
    <div>
      <Title year="2022" to="/"></Title>
      <div className="mt-8 mb-8">
        <p className="font-serif font-bold text-2xl mt-1 mb-1">作品提名</p>
        <p className="text-xs text-muted mt-1 mb-1">2023.3.1-2023.3.10</p>
        <p className="text-subtle mt-1 mb-1">
          提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。
          提名阶段，可以随时打开这个页面检查和提交。
        </p>
      </div>
      <TabLine page={idx} className="mt-8 mb-8" />
      <div className="mt-8 mb-8">
        <p className="font-serif font-bold text-2xl mt-1 mb-1">
          {idx}/5: {info.name}部门
        </p>
        {info.intro}
      </div>
      <NomList
        className="mt-8 mb-8"
        dept={info.dept}
        noms={data.nominations || new Array()}
      />
      <div className="flex flex-row mt-12 mb-4 gap-x-2">
        <ToPrevDP idx={idx} />
        <ToNextDP idx={idx} />
      </div>
      <TabLine page={idx} className="mt-4 mb-4" />
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { index: "1" },
    { index: "2" },
    { index: "3" },
    { index: "4" },
    { index: "5" },
  ];
}
