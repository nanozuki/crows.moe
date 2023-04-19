import Header from '@/app/shared/Header';

export default function Home() {
  return (
    <>
      <Header active="articles" />
      <p className="text-2xl font-serif font-bold text-text">文章列表</p>
    </>
  );
}
