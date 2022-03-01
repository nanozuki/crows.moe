import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { HyperLink, Paragraph } from '../../../components/Article';
import { Container } from '../../../components/Container';
import { Layout } from '../../../components/Layout';

const VoteStep1: NextPage = () => {
  const router = useRouter();
  const { vid } = router.query;
  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/votes/${vid}/4`);
  };
  return (
    <Layout>
      <nav className="bg-subtle text-base font-serif pl-4 pr-4">
        <Container>
          <p className="text-xl pt-em pb-em">5/5: 小说部门</p>
        </Container>
      </nav>
      <main className="pl-4 pr-4">
        <Container>
          <article className="text-text">
            <Paragraph>
              选出2021年内在电视台或者流媒体平台以剧集形式播出过的动画作品。
              跨年份的作品以2021年份内的部分来判断。
            </Paragraph>
            <Paragraph>
              新播出的作品可以参考：
              <HyperLink href="https://zh.wikipedia.org/wiki/日本動畫列表_(2021年)">
                2021年日本动画列表
              </HyperLink>
            </Paragraph>
            <button
              className="w-full sm:max-w-xs block bg-subtle text-base pt-1 pb-1 pl-4 pr-4 mt-2 mb-2"
              onClick={handleClick}
            >
              <p>下一步</p>
            </button>
          </article>
        </Container>
      </main>
    </Layout>
  );
};

export default VoteStep1;
