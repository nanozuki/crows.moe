import { defaultRoute } from '@app/lib/route';
import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import { Head1, Head2, HyperLink, SmallText, Text, multiLine } from '@app/shared/article';
import { service } from '@service/init';
import { Department, Stage, departmentTitle } from '@service/value';
import { redirect } from 'next/navigation';
import BallotSheet from './BallotSheet';

interface NominationPageProps {
  params: { year: number; dept: Department };
}

export default async function Page({ params }: NominationPageProps) {
  const { year, dept } = params;
  const ceremony = await service.getCeremony(year);
  const now = new Date();
  const voter = await service.getLoggedVoter();
  if (ceremony.stageAt(now) !== Stage.Voting || voter === undefined) {
    redirect(defaultRoute(ceremony, now, voter !== undefined));
  }

  const index = ceremony.departments.indexOf(dept);
  const title = departmentTitle[dept];
  const works = await service.getNominations(year, dept);
  const ballot = await service.getBallot(year, dept); // TODO: reduce calling 'voter'
  return (
    <div>
      <Title year={year.toString()} to="/"></Title>
      <div className="mt-8 mb-8 flex flex-col gap-y-4">
        <div>
          <Head1>作品投票</Head1>
          <SmallText>{ceremony.votingRange()}</SmallText>
        </div>
        <Text>
          投票采用
          <HyperLink text="Schulze" href="https://en.wikipedia.org/wiki/Schulze_method" />
          {multiLine(
            '投票制，对范围中的作品写上排名。',
            '排序可以相等、不连续或者空缺，最终的票选结果中，两部作品的排名只与投票中两部作品的相对位置相关。',
            '投票的范围是在提名阶段被提名的所有作品，如果你发现你想投票的作品不在排名之中，请联系工作人员。',
          )}
        </Text>
      </div>
      <TabLine page={index} className="mt-8 mb-8" />
      <Head2 className="mt-8 mb-8">
        {index + 1}/{ceremony.departments.length}: {title}部门
      </Head2>
      <BallotSheet className="mt-8 mb-8" ceremony={ceremony} department={dept} nominations={works} ballot={ballot} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
