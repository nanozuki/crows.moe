import Link from 'next/link';

interface TitleProps {
  year?: string;
  to: string;
}

function Title({ year, to }: TitleProps) {
  return (
    <header key="header" className="font-serif mt-8 mb-8">
      <Link href={to}>
        {year && <p>{year}</p>}
        <p>{"Exodus Media Awards"}</p>
        <p className="text-3xl font-bold">Exodus 媒体艺术赏</p>
      </Link>
    </header>
  );
}

export default Title;
