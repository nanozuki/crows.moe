import { readFile } from 'fs/promises';
import { opendir } from 'fs/promises';
import { compileMDX } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import path from 'path';
import { HTMLAttributes } from 'react';

export interface ArticleMeta {
  intro: string;
  publish_data: string;
  tags: string;
}

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
    const [pa, pb] = [a.meta.publish_data, b.meta.publish_data];
    if (pa < pb) return -1;
    if (pa > pb) return 1;
    return 0;
  });
  allArticles = articles;
  return articles;
}

const components = {
  h1: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-text font-serif font-bold my-em leading-normal text-3xl">
      {children}
    </h1>
  ),
  h2: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-text font-serif font-bold my-em leading-normal text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-text font-serif font-bold my-em leading-normal text-xl">
      {children}
    </h3>
  ),
  h4: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-text font-sans font-bold my-em leading-normal">
      {children}
    </h4>
  ),
  h5: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="text-text font-sans font-bold my-em leading-normal">
      {children}
    </h5>
  ),
  p: ({ children }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-text font-sans my-em leading-normal">{children}</p>
  ),
  img: (
    { src, alt }: any // TODO: find the type
  ) => <img src={src} alt={alt} className="block w-full my-4" />,
  Red: ({ children }: { children: React.ReactNode }) => (
    <p className="text-rose">{children}</p>
  ),
};

export default function Article({ name, meta, content }: ArticleData) {
  return (
    <article>
      <h1>{name.replaceAll('_', ' ')}</h1>
      <p>简介: {meta.intro}</p>
      <p>发表于: {meta.publish_data}</p>
      <p>Tags: {meta.tags}</p>
      {content}
    </article>
  );
}
