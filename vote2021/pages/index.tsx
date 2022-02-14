import type { NextPage } from 'next';

import { Entrance } from '../components/Entrance';

const Home: NextPage = () => {
  const toNewVote = (userID: string) => {
    console.log('userID:', userID);
  };
  const viewVote = (voteID: string) => {
    console.log('voteID:', voteID);
  };

  return (
    <div className="bg-base min-h-screen w-full max-w-screen-sm ml-auto mr-auto">
      <header className="bg-love text-highlight-low font-serif p-4">
        <p>2021年</p>
        <p>{"Programmers' Exodus"}</p>
        <p className="text-3xl font-bold underline">
          媒体艺术祭 <small>投票环节</small>
        </p>
      </header>
      <main className="pl-4 pr-4">
        <Entrance title="新投票" onSubmit={toNewVote} />
        <Entrance title="查看/修改投票" onSubmit={viewVote} />
      </main>
    </div>
  );
};

export default Home;
