import Link from 'next/link';
import Header from '@/app/shared/Header';
import { getArticleDatas } from '../shared/Article';

export default async function Articles() {
  const articles = await getArticleDatas();
  return (
    <>
      <Header active="articles" />
      <ul>
        {articles.map((article) => (
          <li key={article.name}>
            <Link href={`/articles/${article.name}`} className="underline">
              {`o> ${article.name}`}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
