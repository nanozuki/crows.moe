import Title from '@app/shared/Title';
import ToNextButton from '@app/shared/ToNextButton';

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

export default function Home() {
  return [
    <Title key="title" to="/" />,
    <main key="main">
      <AnnualItem year={2022} to={'/2022/nomination/1'} state="作品提名" />
      <AnnualItem
        year={2021}
        to={'https://vote2021.crows.moe'}
        state="获奖作品"
      />
    </main>,
  ];
}
