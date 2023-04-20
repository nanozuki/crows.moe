import Article, { getArticleDatas } from '@/app/shared/Article';
import { notFound } from 'next/navigation';

interface ArticlePageParams {
  name: string;
}

interface ArticlePageProps {
  params: ArticlePageParams;
}

export async function generateStaticParams(): Promise<ArticlePageParams[]> {
  const articles = await getArticleDatas();
  return articles.map(({ name }) => ({ name }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const name = decodeURI(params.name);
  const article = (await getArticleDatas()).find((a) => a.name === name);
  if (!article) {
    notFound();
  }
  return <Article {...article} />;
}
