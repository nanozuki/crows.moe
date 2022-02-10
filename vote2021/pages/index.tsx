import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div>
      <header>
        <p>2021年</p>
        <p>Programmers' Exodus</p>
        <p className="text-3xl font-bold underline">
          媒体艺术祭 <small>投票环节</small>
        </p>
      </header>
      <main>
        <section>
          <h1>新投票</h1>
          <p>请输入你的telegram ID或者昵称</p>
          <label htmlFor="user id">
            <input type="text" />
          </label>
        </section>
        <section>
          <h1>查看/修改投票</h1>
          <p>请输入投票ID</p>
          <label htmlFor="vote id">
            <input type="text" />
          </label>
        </section>
      </main>
    </div>
  );
};

export default Home;
