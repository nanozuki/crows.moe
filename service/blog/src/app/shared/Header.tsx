import Link from 'next/link';
import { useMemo } from 'react';

const items = {
  articles: { href: '/articles', text: '文章列表' },
  about: { href: '/about', text: '关于' },
};

type NavItem = keyof typeof items;

function Title() {
  return (
    <Link href={'/'}>
      <p className="text-text text-4xl font-black font-serif">鸦之歌</p>
    </Link>
  );
}

interface NavProps {
  active?: NavItem;
}

function Nav({ active }: NavProps) {
  const links = useMemo(
    () =>
      Object.entries(items).map(([key, value]) => {
        const color = key === active ? 'text-love' : 'text-text';
        return (
          <Link key={key} href={value.href} className={color}>
            {value.text}
          </Link>
        );
      }),
    [active]
  );
  return <nav className="flex flex-row gap-x-2">{links}</nav>;
}

type HeaderProps = NavProps;

export default function Header({ active }: HeaderProps) {
  return (
    <header className="flex flex-col gap-y-2">
      <Title />
      <Nav active={active} />
    </header>
  );
}
