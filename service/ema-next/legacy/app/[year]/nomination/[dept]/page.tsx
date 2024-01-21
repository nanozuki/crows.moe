import { defaultRoute } from '@app/lib/route';
import DeptNav from '@app/shared/DeptNav';
import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import { Head1, HyperLink, SmallText, Text, multiLine } from '@app/shared/article';
import { getService } from '@service/init';
import { Department, Stage, departmentInfo } from '@service/value';
import { redirect } from 'next/navigation';
import NomList from './NomList';
import { getNominationRange, getStage } from '@service/entity';

interface NominationPageProps {
  params: { year: number; dept: Department };
}

export default async function Page({ params }: NominationPageProps) {
  const { year, dept } = params;
  const service = await getService();
  const ceremony = await service.getCeremony(year);
  const now = new Date();
  if (getStage(ceremony, now) != Stage.Nomination) {
    redirect(defaultRoute(ceremony, now, false)); //TODO: check logged in
  }
  const index = ceremony.departments.indexOf(dept);
  const info = departmentInfo(year)[dept];
  const noms = await service.getNominations(year, dept);
  return (
    <div>
      <Title year={year.toString()} to="/"></Title>
      <div className="mt-8 mb-8">
        <Head1>作品提名</Head1>
        <SmallText>{getNominationRange(ceremony).join('-')}</SmallText>
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
          {index + 1}/{ceremony.departments.length}: {info.title}部门
        </Head1>
        <Text>{info.introduction}</Text>
        <Text>参考链接：</Text>
        {info.reference.map((ref) => (
          <HyperLink key={ref.url} text={ref.description} href={ref.url} />
        ))}
      </div>
      <NomList className="mt-8 mb-8" year={year} dept={dept} noms={noms} />
      <DeptNav ceremony={ceremony} department={dept} stage={Stage.Nomination} className="mt-12 mb-4" />
      <TabLine page={index} className="mt-4 mb-4" />
    </div>
  );
}

export const dynamic = 'force-dynamic';
