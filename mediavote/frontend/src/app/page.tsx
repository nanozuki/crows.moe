import Link from 'next/link';
import IconChevronRight from '~icons/material-symbols/chevron-right.jsx';

interface NavToButtonProps {
  to: string;
  label: string;
}

function NavToButton({ label, to }: NavToButtonProps) {
  return (
    <Link
      href={to}
      className="flex flex-row items-center bg-highlight-med h-10 pl-4 pr-1 rounded"
    >
      <p>{label}</p>
      <IconChevronRight className="block text-xl leading-none text-rose" />
    </Link>
  );
}

interface AnnualItemProps extends NavToButtonProps {
  year: number;
}

function AnnualItem({ year, to, label }: AnnualItemProps) {
  return (
    <div className="flex flex-row items-center mt-4 mb-4">
      <p className="font-serif text-2xl font-bold w-24 mr-2">{year}年</p>
      <NavToButton {...{ to, label }}></NavToButton>
    </div>
  );
}

export default function Home() {
  return [
    <header key="header" className="font-serif mt-8 mb-8">
      <Link href="/">
        <p>{"Programmers' Exodus"}</p>
        <p className="text-3xl font-bold">媒体艺术祭</p>
      </Link>
    </header>,
    <main key="main">
      <AnnualItem year={2022} to={'/2022/nomination'} label="获奖作品" />
      <AnnualItem
        year={2021}
        to={'https://vote2021.crows.moe'}
        label="获奖作品"
      />
    </main>,
  ];
}
