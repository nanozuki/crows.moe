import { defaultRoute, Route } from '@app/lib/route';
import { Head1, Text } from '@app/shared/article';
import Title from '@app/shared/Title';
import { getService } from '@service/init';
import { Stage } from '@service/value';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { year: number } }) {
  const { year } = params;
  const service = await getService();
  const ceremony = await service.getCeremony(year);
  const voter = await service.getLoggedVoter();
  const now = new Date();
  if (ceremony.stageAt(now) !== Stage.Voting || voter === undefined) {
    redirect(defaultRoute(ceremony, now, voter !== undefined));
  }
  const route = Route.Voting(ceremony, 0);
  return (
    <div>
      <Title year={year.toString()} to="/"></Title>
      <div className="mt-8 mb-8 flex flex-col gap-y-4">
        <Head1>投票完成！</Head1>
        <Text>投票已完成！{voter.name}，感谢您的参与。</Text>
        <Text>
          点击或保存此链接：
          <a href={route} className="text-pine ml-1 mr-1 underline">
            {`https://mediavote.crows.moe${route}`}
          </a>
          。在投票期间可以随时查看和修改自己的投票。
        </Text>
      </div>
    </div>
  );
}
