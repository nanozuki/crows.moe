import { getAwards, getCurrentYear } from '@app/lib/apis';
import { getYearInfo } from '@app/lib/stage';
import { Award, DepartmentName, Stage } from '@app/lib/models';
import { redirect } from 'next/navigation';
import { Head1, Head2, Text } from '@app/shared/article';
import Title from '@app/shared/Title';
import { DepartmentInfo } from '@app/shared/Departments';
// import NomItem from '../nomination/[dept]/NomItem';
import { departments } from '@app/shared/Departments';

interface GrandPrizeProps {
  dept: DepartmentInfo;
  award: Award;
}

function GrandPrize({ dept, award }: GrandPrizeProps) {
  const items = award.rankings.filter((r) => r.ranking === 1);
  return (
    <div className="flex flex-col gap-y-2">
      <Text>{dept.title}部门</Text>
      {items.map((item) => [
        <p
          key={`${item.work.name}-name`}
          className="font-serif font-extrabold text-3xl"
        >
          {item.work.name}
        </p>,
        <p key={`${item.work.name}-origin`} className="text-subtle text-sm">
          {item.work.origin_name}
        </p>,
      ])}
    </div>
  );
}

interface PrizeProps {
  dept: DepartmentInfo;
  award: Award;
}

function Prize({ dept, award }: PrizeProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <Text>{dept.title}部门</Text>
      <div className="w-full grid grid-cols-ballot">
        {award.rankings.map((item) => [
          <div key={`${item.work.name}-ranking`} className="w-8 text-subtle">
            {item.ranking}
          </div>,
          <Text key={`${item.work.name}-name`}>{item.work.name}</Text>,
        ])}
      </div>
    </div>
  );
}

export default async function Page() {
  // TODO: check current year === year in url
  const year = await getCurrentYear();
  const yearInfo = await getYearInfo(year);
  if (yearInfo.stage !== Stage.Award || yearInfo.voter) {
    redirect(yearInfo.redirectTo);
  }

  const awards = await getAwards(year.year);
  const awardsByDept: Map<DepartmentName, Award> = new Map();
  for (const award of awards) {
    awardsByDept.set(award.dept, award);
  }
  return (
    <div>
      <Title year="2022" to="/"></Title>
      <Head1>获奖作品</Head1>
      <div className="mt-8 mb-8 flex flex-col gap-y-8">
        <Head1>大赏</Head1>
        {departments.map((dept) => (
          <GrandPrize
            key={dept.dept}
            dept={dept}
            award={awardsByDept.get(dept.dept) as Award}
          />
        ))}
      </div>
      <div className="mt-8 mb-8 flex flex-col gap-y-4">
        <Head2>详情</Head2>
        {departments.map((dept) => (
          <Prize
            key={dept.dept}
            dept={dept}
            award={awardsByDept.get(dept.dept) as Award}
          />
        ))}
      </div>
    </div>
  );
}
