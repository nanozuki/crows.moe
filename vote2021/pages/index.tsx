import type { NextPage } from 'next';

import { Entrance } from '../components/Entrance';
import { Container } from '../components/Container';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const router = useRouter();
  const toNewVote = (userID: string) => {
    // TODO: create new vote, get the vote id
    router.push(`/votes/${userID}/0`);
  };
  const viewVote = (voteID: string) => {
    router.push(`/votes/${voteID}/0`);
  };

  return (
    <Layout>
      <main className="pl-4 pr-4">
        <Container>
          <Entrance title="新投票" onSubmit={toNewVote} />
          <Entrance title="查看/修改投票" onSubmit={viewVote} />
        </Container>
      </main>
    </Layout>
  );
};

export default Home;
