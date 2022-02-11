import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="max-w-2xl ml-auto mr-auto">
      <header className="bg-love text-highlight-low font-serif p-4">
        <p>2021年</p>
        <p>Programmers' Exodus</p>
        <p className="text-3xl font-bold underline">
          媒体艺术祭 <small>投票环节</small>
        </p>
      </header>
      <main className="pl-4 pr-4">
        <section>
          <h1 className="text-xl mt-em mb-em">新投票</h1>
          <p>请输入你的telegram ID或者昵称</p>
          <label htmlFor="user id">
            <input type="text" />
          </label>
          <button className="block bg-subtle text-base pt-1 pb-1 pl-4 pr-4 rounded-md mt-4 mb-4">
            <p>开始投票</p>
          </button>
        </section>
        <section>
          <h1 className="text-xl mt-em mb-em">查看/修改投票</h1>
          <p>请输入投票ID</p>
          <label htmlFor="vote id">
            <input type="text" />
          </label>
          <button className="block bg-subtle text-base pt-1 pb-1 pl-4 pr-4 rounded-md mt-4 mb-4">
            <p>确认</p>
          </button>
        </section>
      </main>
    </div>
  );
};

export default Home;
