import Title from '@app/shared/Title';
import ToNextButton from '@app/shared/ToNextButton';
import { getService } from '@service/init';
import { Stage, stageCNString } from '@service/value';
import { defaultRoute } from './lib/route';
import { getStage } from '@service/entity';

interface AnnualItemProps {
  year: number;
  label: string;
  to?: string;
}

function AnnualItem({ year, label, to }: AnnualItemProps) {
  return (
    <div className="flex flex-row items-center mt-4 mb-4">
      <p className="font-serif text-2xl font-bold w-24 mr-2">{year}年</p>
      {to && <ToNextButton label={label} to={to} />}
    </div>
  );
}

export default async function Home() {
  const service = await getService();
  const ceremonies = await service.getCeremonies();
  const logged = (await service.getLoggedVoter()) !== undefined;
  const now = new Date();
  const items = ceremonies.map((c) => {
    const stage = getStage(c, now);
    const to = stage !== Stage.Preparation ? defaultRoute(c, now, logged) : undefined;
    const label = stageCNString(stage);
    return <AnnualItem key={c.year} year={c.year} to={to} label={label} />;
  });
  return [<Title key="title" to="/" />, <main key="main">{items}</main>];
}

export const revalidate = 3600;
