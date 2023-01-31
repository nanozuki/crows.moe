'use client';

import { Entrance } from '@/components/Entrance';
import { Container } from '@/components/Container';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { Result } from '@/components/Result';

function Home() {
  const router = useRouter();
  const viewVote = async (voteID: string) => {
    if ((voteID || '') === '') {
      throw new Error('Vote ID 不能为空');
    }
    const res = await fetch(`/api/vote/${voteID}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }
    await res.json();
    router.push(`/votes/${voteID}/0`);
  };

  return (
    <Layout>
      <main className="pl-4 pr-4">
        <Container>
          <Result />
          <Entrance title="查看投票记录" label="Vote ID" onSubmit={viewVote} />
        </Container>
      </main>
    </Layout>
  );
}

export default Home;
