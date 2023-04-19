import { Head1, Text, SmallText, multiLine } from '@app/shared/article';
import { notFound } from 'next/navigation';
import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import NomList from './NomList';
import { DepartmentName, departmentNameIsValid, Stage } from '@app/lib/models';
import { getNominations } from '@app/lib/apis';
import { departments } from '@app/shared/Departments';
import DeptNav from '@app/shared/DeptNav';

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
            '提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。',
            '提名阶段，可以随时打开这个页面检查和提交。'
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
      <DeptNav dept={dept} stage={Stage.Nomination} className="mt-12 mb-4" />
      <TabLine page={index} className="mt-4 mb-4" />
    </div>
  );
}

export const dynamic = 'force-dynamic';
