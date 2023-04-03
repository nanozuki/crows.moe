import Title from '@app/shared/Title';
import ToNextButton from '@app/shared/ToNextButton';
import { getYears } from './lib/apis';
import { getYearInfo } from './lib/stage';
import { cookies } from 'next/headers';

interface AnnualItemProps {
  year: number;
  stage: string;
  to: string;
}

function AnnualItem({ year, to, stage: state }: AnnualItemProps) {
  return (
    <div className="flex flex-row items-center mt-4 mb-4">
      <p className="font-serif text-2xl font-bold w-24 mr-2">{year}年</p>
      <ToNextButton label={state} to={to} />
    </div>
  );
}

export default async function Home() {
  const cookieStore = cookies();
  console.log('cookies: ', cookieStore.getAll());
  const years = await getYears();
  const yearInfos = await Promise.all(years.map(getYearInfo));
  const items = yearInfos.map((yearInfo) => (
    <AnnualItem
      key={yearInfo.year}
      year={yearInfo.year}
      to={yearInfo.redirectTo}
      stage={yearInfo.stageName}
    />
  ));
  items.push(
    <AnnualItem
      key={2021}
      year={2021}
      to={'https://vote2021.crows.moe'}
      stage="获奖作品"
    />
  );
  return [<Title key="title" to="/" />, <main key="main">{items}</main>];
}

export const revalidate = 3600;
