import { readFile } from 'fs/promises';
import { opendir } from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import NextImage from 'next/image';
import path from 'path';
import ArticleTitle, { ArticleMeta } from '@/app/shared/ArticleTitle';

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const Image = (props: ImageProps) => (
  <div className="w-[calc(100%+2rem)] -mx-4 my-4 wide:w-full wide:mx-0 ">
    <NextImage className="block bg-overlay" loading="eager" {...props} />
  </div>
);

export interface ArticleData {
  name: string;
  meta: ArticleMeta;
  content: React.ReactElement;
}

const articleDir = 'articles';
let allArticles: ArticleData[] | undefined = undefined;

async function readArticleProps(filename: string): Promise<ArticleData> {
  const name = path.parse(filename).name;
  const source = await readFile(filename, { encoding: 'utf-8' });
  const { content, frontmatter: meta } = await compileMDX<ArticleMeta>({
    source,
    components,
    options: { parseFrontmatter: true },
  });
  return { name, meta, content };
}

export async function getArticleDatas(): Promise<ArticleData[]> {
  if (allArticles) return allArticles;

  const dir = await opendir(articleDir, { encoding: 'utf8' });
  const files: string[] = [];
  for await (const dirent of dir) {
    if (dirent.isFile() && path.extname(dirent.name) === '.mdx') {
      files.push(path.join(articleDir, dirent.name));
    }
  }
  const articles = await Promise.all(files.map(readArticleProps));
  articles.sort((a, b) => {
    const [pa, pb] = [a.meta.publish_date, b.meta.publish_date];
    if (pa < pb) return -1;
    if (pa > pb) return 1;
    return 0;
  });
  allArticles = articles;
  return articles;
}

const components = {
  h1: ({ children }: JSX.IntrinsicElements['h1']) => (
    <h1 className="text-text font-serif font-bold my-em leading-normal text-3xl">
      {children}
    </h1>
  ),
  h2: ({ children }: JSX.IntrinsicElements['h2']) => (
    <h2 className="text-text font-serif font-bold my-em leading-normal text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }: JSX.IntrinsicElements['h3']) => (
    <h3 className="text-text font-serif font-bold my-em leading-normal text-xl">
      {children}
    </h3>
  ),
  h4: ({ children }: JSX.IntrinsicElements['h4']) => (
    <h4 className="text-text font-sans font-bold my-em leading-normal">
      {children}
    </h4>
  ),
  h5: ({ children }: JSX.IntrinsicElements['h5']) => (
    <h5 className="text-text font-sans font-bold my-em leading-normal">
      {children}
    </h5>
  ),
  p: ({ children }: JSX.IntrinsicElements['p']) => (
    <p className="text-text font-sans my-em leading-normal">{children}</p>
  ),
  li: ({ children }: JSX.IntrinsicElements['li']) => (
    <li className="text-text leading-normal">{children}</li>
  ),
  pre: ({ children }: JSX.IntrinsicElements['pre']) => (
    <pre className="text-text font-monospace">{children}</pre>
  ),
  Image,
};

export default function Article({ name, meta, content }: ArticleData) {
  return (
    <article>
      <ArticleTitle name={name} meta={meta} className="mb-8" />
      {content}
    </article>
  );
}
