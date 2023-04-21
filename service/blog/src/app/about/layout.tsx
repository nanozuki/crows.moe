import Header from '@/app/shared/Header';

export const metadata = {
  title: '鸦之歌-关于',
  description: "About Nanozuki's personal website",
  openGraph: {
    title: '鸦之歌-关于',
    description: "About Nanozuki's personal website",
    type: 'website',
    locale: 'zh-CN',
    url: 'https://crows.moe/about',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header active="about" />
      {children}
    </>
  );
}
