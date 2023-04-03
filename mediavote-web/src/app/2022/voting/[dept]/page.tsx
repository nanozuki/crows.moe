import { Head1 } from '@app/shared/article';
import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import { DepartmentName } from '@app/lib/models';
import { departments } from '@app/shared/Departments';
import { getBallot, getNominations } from '@app/lib/apis';
import BallotTable from './BallotTable';
import { cookies } from 'next/headers';

interface NominationPageProps {
  params: { dept: DepartmentName };
}

export default async function Page({ params }: NominationPageProps) {
  const sessionid = cookies().get('sessionid')?.value;
  console.log('sessionid: ', sessionid);
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
      <Head1 className="mt-8 mb-8">
        {index + 1}/{departments.length}: {info.title}部门
      </Head1>
      <BallotTable className="mt-8 mb-8" nominations={works} ballot={ballot} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
