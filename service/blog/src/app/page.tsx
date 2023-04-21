import Header from '@/app/shared/Header';
import Link from 'next/link';
import { getArticleDatas } from '@/app/shared/Article';
import ArticleTitle from '@/app/shared/ArticleTitle';

export default async function Home() {
  const articles = (await getArticleDatas()).slice(0, 3);
  return (
    <>
      <Header />
      <section className="flex flex-col gap-y-4">
        <p key="title" className="text-2xl font-serif font-bold text-text">
          最新文章
        </p>
        {articles.map((article) => (
          <Link
            key={article.name}
            className="block bg-overlay hover:bg-surface active:bg-highlight-med p-4 rounded -mx-4"
            href={`/articles/${article.name}`}
          >
            <ArticleTitle name={article.name} meta={article.meta} />
          </Link>
        ))}
      </section>
    </>
  );
}
