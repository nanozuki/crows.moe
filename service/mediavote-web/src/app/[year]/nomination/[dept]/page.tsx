import { Head1, Text, SmallText, multiLine } from '@app/shared/article';
import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import NomList from './NomList';
import DeptNav from '@app/shared/DeptNav';
import { Department, Stage, departmentInfo } from "@service/value";
import { service } from '@service/init';
import { makeYearView } from '@app/lib/view';
import { redirect } from 'next/navigation';

interface NominationPageProps {
  params: { year: number, dept: Department };
}

export default async function Page({ params }: NominationPageProps) {
  const { year, dept } = params;
  const y = await service.getYear(year);
  const view = makeYearView(y);
  if (view.stage !== Stage.Nomination) {
    redirect(view.defaultPage as string);
  }
  const index = y.departments.indexOf(dept);
  const info = departmentInfo(year)[dept];
  const noms = await service.getNominations(year, dept);
  return (
    <div>
      <Title year={year.toString()} to="/"></Title>
      <div className="mt-8 mb-8">
        <Head1>作品提名</Head1>
        <SmallText>{y.nominationRange().join('-')}</SmallText>
        <Text>
          {multiLine(
            '提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。',
            '提名阶段，可以随时打开这个页面检查和提交。',
          )}
        </Text>
      </div>
      <TabLine page={index} className="mt-8 mb-8" />
      <div className="mt-8 mb-8">
        <Head1>
          {index + 1}/{y.departments.length}: {info.title}部门
        </Head1>
        <Text>{info.introduction}</Text>
      </div>
      <NomList className="mt-8 mb-8" year={year} dept={dept} noms={noms} />
      <DeptNav year={y} department={dept} stage={Stage.Nomination} className="mt-12 mb-4" />
      <TabLine page={index} className="mt-4 mb-4" />
    </div>
  );
}

export const dynamic = 'force-dynamic';
