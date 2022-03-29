import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Paragraph, Quote } from '../../../components/Article';
import { Container } from '../../../components/Container';
import { Layout } from '../../../components/Layout';

const VoteEnd: NextPage = () => {
  const router = useRouter();
  const { vid } = router.query;
  return (
    <Layout>
      <nav className="bg-subtle text-base font-serif pl-4 pr-4">
        <Container>
          <p className="text-xl pt-em pb-em">投票完成</p>
        </Container>
      </nav>
      <main className="pl-4 pr-4">
        <Container>
          <article className="text-text">
            <Paragraph>投票完成！谢谢您的参与！</Paragraph>
            <Paragraph>您本次的投票ID为:</Paragraph>
            <Quote>{vid}</Quote>
            <Paragraph>请记住此ID用以查看或者修改自己的投票。</Paragraph>
          </article>
        </Container>
      </main>
    </Layout>
  );
};

export default VoteEnd;
