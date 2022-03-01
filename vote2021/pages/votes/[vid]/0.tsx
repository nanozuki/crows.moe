import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { HyperLink, Paragraph, Quote } from '../../../components/Article';
import { Container } from '../../../components/Container';
import { Layout } from '../../../components/Layout';

const VoteStep0: NextPage = () => {
  const router = useRouter();
  const { vid } = router.query;
  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/votes/${vid}/1`);
  };
  return (
    <Layout>
      <nav className="bg-subtle text-base font-serif pl-4 pr-4">
        <Container>
          <p className="text-xl pt-em pb-em">0/5: 规则介绍</p>
        </Container>
      </nav>
      <main className="pl-4 pr-4">
        <Container>
          <article className="text-text">
            <Paragraph>
              投票范围为2021年1月1日至2021年12月31日发布的作品，以及跨年份作品的2021年内的部分。
              分为TV动画、非TV动画、漫画、游戏、文学五个部门。
              具体范围另见每个部门的说明品，
            </Paragraph>
            <Paragraph>
              本次投票采取
              <HyperLink href="https://en.wikipedia.org/wiki/Schulze_method">
                Schulze投票制
              </HyperLink>
              ，将推荐或喜爱的作品，写进投票并排序。
              排序可以相等，也可以不连续，最终的票选结果中，两部作品的排名只与投票中两部作品的相对位置相关。
            </Paragraph>
            <Paragraph>您本次的投票ID为:</Paragraph>
            <Quote>{vid}</Quote>
            <Paragraph>
              请记住次ID或者直接保存本页链接，用以查看或者修改自己的投票。
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

export default VoteStep0;
