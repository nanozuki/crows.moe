import { Head1, Text, SmallText, multiLine } from "@app/shared/article";
import { notFound } from "next/navigation";
import TabLine from "@app/shared/TabLine";
import Title from "@app/shared/Title";
import ToNextButton from "@app/shared/ToNextButton";
import ToPrevButton from "@app/shared/ToPrevButton";
import NomList from "./NomList";
import { DepartmentName, departmentNameIsValid } from "@app/lib/models";
import { getNominations } from "@app/lib/apis";
import { departments } from "@app/shared/Departments";

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
      className={`${className || ""}`}
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
        className={`flex flex-row items-center bg-highlight-low text-subtle h-10 pl-8 pr-8 rounded ${
          className || ""
        }`}
      >
        <p>完成</p>
      </div>
    );
  }
  const next = departments[idx + 1];
  return (
    <ToNextButton
      className={`${className || ""}`}
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
            "提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。",
            "提名阶段，可以随时打开这个页面检查和提交。"
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

export const dynamic = "force-dynamic";
