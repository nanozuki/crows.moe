import { getCurrentYear } from '@app/lib/apis';
import { getYearInfo } from '@app/lib/stage';
import { Head1, Head2 } from '@app/shared/article';
import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import { DepartmentName, Stage } from '@app/lib/models';
import { departments } from '@app/shared/Departments';
import { getBallot, getNominations } from '@app/lib/apis';
import BallotSheet from './BallotSheet';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface NominationPageProps {
  params: { dept: DepartmentName };
}

export default async function Page({ params }: NominationPageProps) {
  // TODO: check current year === year in url
  const year = await getCurrentYear();
  const yearInfo = await getYearInfo(year);
  if (yearInfo.stage !== Stage.Voting || !yearInfo.voter) {
    redirect(yearInfo.redirectTo);
  }
  const sessionid = cookies().get('sessionid')?.value;
  const { dept } = params;
  const index = departments.findIndex((info) => info.dept === dept);
  const info = departments[index];
  const works = await getNominations(dept);
  const ballot = await getBallot({ dept, sessionid });
  return (
    <div>
      <Title year="2022" to="/"></Title>
      <div className="mt-8 mb-8">
        <Head1>作品投票</Head1>
      </div>
      <TabLine page={index} className="mt-8 mb-8" />
      <Head2 className="mt-8 mb-8">
        {index + 1}/{departments.length}: {info.title}部门
      </Head2>
      <BallotSheet
        className="mt-8 mb-8"
        dept={dept}
        nominations={works}
        ballot={ballot}
      />
    </div>
  );
}

export const dynamic = 'force-dynamic';
