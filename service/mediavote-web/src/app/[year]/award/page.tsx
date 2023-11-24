import { defaultRoute } from '@app/lib/route';
import Title from '@app/shared/Title';
import { Head1, Head2, Text } from '@app/shared/article';
import { Award, getStage } from '@service/entity';
import { getService } from '@service/init';
import { Department, Stage, departmentTitle } from '@service/value';
import { redirect } from 'next/navigation';

interface GrandPrizeProps {
  award: Award;
  department: Department
}

function GrandPrize({ award, department }: GrandPrizeProps) {
  const items = award.rankings.filter((r) => r.ranking === 1);
  return (
    <div className="flex flex-col gap-y-2">
      <Text>{departmentTitle[department]}部门</Text>
      {items.map((item) => [
        <p key={`${item.work.name}-name`} className="font-serif font-extrabold text-3xl">
          {item.work.name}
        </p>,
        <p key={`${item.work.name}-origin`} className="text-subtle text-sm">
          {item.work.originName}
        </p>,
      ])}
    </div>
  );
}

interface PrizeProps {
  award: Award;
  department: Department
}

function Prize({ award, department }: PrizeProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <Text>{departmentTitle[department]}部门</Text>
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

export default async function Page({ params }: { params: { year: number } }) {
  const { year } = params;
  const service = await getService();
  const ceremony = await service.getCeremony(year);
  const now = new Date();
  if (getStage(ceremony, now) != Stage.Award) {
    redirect(defaultRoute(ceremony, now, false)); //TODO: check logged in
  }
  const items = await Promise.all(ceremony.departments.map(async (dept) => {
    return {
      award: await service.getAward(year, dept),
      department: dept,
    };
  }));

  return (
    <div>
      <Title year={year.toString()} to="/"></Title>
      <Head1>获奖作品</Head1>
      <div className="mt-8 mb-8 flex flex-col gap-y-8">
        <Head1>大赏</Head1>
        {items.map(({ award, department }) => (
          <GrandPrize key={department} department={department} award={award} />
        ))}
      </div>
      <div className="mt-8 mb-8 flex flex-col gap-y-4">
        <Head2>详情</Head2>
        {items.map(({ award, department }) => (
          <Prize key={department} department={department} award={award} />
        ))}
      </div>
    </div>
  );
}
