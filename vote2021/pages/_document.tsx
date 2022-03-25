import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <title>{"2021年Programmers' Exodus媒体艺术祭投票"}</title>
        <meta
          property="og:title"
          content="2021年Programmers' Exodus媒体艺术祭投票"
        />
      </Head>
      <body className="bg-base">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
