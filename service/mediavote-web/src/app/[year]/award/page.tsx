import { defaultRoute } from '@app/lib/route';
import Title from '@app/shared/Title';
import { Head1, Head2, Text } from '@app/shared/article';
import { Award } from '@service/entity';
import { service } from '@service/init';
import { Stage, departmentTitle } from '@service/value';
import { redirect } from 'next/navigation';

interface GrandPrizeProps {
  award: Award;
}

function GrandPrize({ award }: GrandPrizeProps) {
  const items = award.rankings.filter((r) => r.ranking === 1);
  return (
    <div className="flex flex-col gap-y-2">
      <Text>{departmentTitle[award.department]}部门</Text>
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
}

function Prize({ award }: PrizeProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <Text>{departmentTitle[award.department]}部门</Text>
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
  const ceremony = await service.getCeremony(year);
  const now = new Date();
  if (ceremony.stageAt(now) != Stage.Award) {
    redirect(defaultRoute(ceremony, now, false)); //TODO: check logged in
  }
  const awards = await Promise.all(ceremony.departments.map(async (dept) => service.getAward(year, dept)));

  return (
    <div>
      <Title year={year.toString()} to="/"></Title>
      <Head1>获奖作品</Head1>
      <div className="mt-8 mb-8 flex flex-col gap-y-8">
        <Head1>大赏</Head1>
        {awards.map((award) => (
          <GrandPrize key={award.department} award={award} />
        ))}
      </div>
      <div className="mt-8 mb-8 flex flex-col gap-y-4">
        <Head2>详情</Head2>
        {awards.map((award) => (
          <Prize key={award.department} award={award} />
        ))}
      </div>
    </div>
  );
}
