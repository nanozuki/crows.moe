import Title from '@app/shared/Title';
import ToNextButton from '@app/shared/ToNextButton';
import { getCurrentYear } from './lib/apis';
import { getRedirectUrlByStage, getStage, getStageName } from './lib/stage';

interface AnnualItemProps {
  year: number;
  state: string;
  to: string;
}

function AnnualItem({ year, to, state }: AnnualItemProps) {
  return (
    <div className="flex flex-row items-center mt-4 mb-4">
      <p className="font-serif text-2xl font-bold w-24 mr-2">{year}年</p>
      <ToNextButton label={state} to={to} />
    </div>
  );
}

export default async function Home() {
  const year = await getCurrentYear();
  const stage = getStage(year);
  const to = await getRedirectUrlByStage(year);
  console.log('year', year, 'stage', stage, 'to', to);
  return [
    <Title key="title" to="/" />,
    <main key="main">
      <AnnualItem year={2022} to={to} state={getStageName(stage)} />
      <AnnualItem
        year={2021}
        to={'https://vote2021.crows.moe'}
        state="获奖作品"
      />
    </main>,
  ];
}

export const revalidate = 3600;
