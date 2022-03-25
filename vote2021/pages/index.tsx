import type { NextPage } from 'next';

import { Entrance } from '../components/Entrance';
import { Container } from '../components/Container';
import { useRouter } from 'next/router';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const router = useRouter();
  const toNewVote = (userID: string) => {
    if ((userID || '') === '') {
      throw new Error('用户名不能为空');
    }
    fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: userID }),
    })
      .then(async (res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        } else {
          return res.json();
        }
      })
      .then((data) => {
        router.push(`/votes/${data.id}/0`);
      });
  };
  const viewVote = (voteID: string) => {
    if ((voteID || '') === '') {
      throw new Error('Vote ID 不能为空');
    }
    fetch(`/api/vote/${voteID}`)
      .then(async (res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        } else {
          return res.json();
        }
      })
      .then((_) => {
        router.push(`/votes/${voteID}/0`);
      });
  };

  return (
    <Layout>
      <main className="pl-4 pr-4">
        <Container>
          <Entrance
            title="新投票"
            label="Telegram ID 或用户名"
            onSubmit={toNewVote}
          />
          <Entrance title="查看/修改投票" label="Vote ID" onSubmit={viewVote} />
        </Container>
      </main>
    </Layout>
  );
};

export default Home;
