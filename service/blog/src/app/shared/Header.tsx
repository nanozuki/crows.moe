import Link from 'next/link';

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
  const links = Object.entries(items).map(([key, value]) => {
    if (key === active) {
      return (
        <p
          key={key}
          className={`leading-normal text-love border-b-2 border-b-base hover:border-b-love`}
        >
          {value.text}
        </p>
      );
    }
    return (
      <Link key={key} href={value.href}>
        <p
          className={`leading-normal text-text border-b-base border-b-2 hover:border-b-text active:border-b-highlight-med`}
        >
          {value.text}
        </p>
      </Link>
    );
  });
  return <nav className="flex flex-row gap-x-4">{links}</nav>;
}

type HeaderProps = NavProps;

export default function Header({ active }: HeaderProps) {
  return (
    <header className="flex flex-col gap-y-4">
      <Title />
      <Nav active={active} />
    </header>
  );
}
