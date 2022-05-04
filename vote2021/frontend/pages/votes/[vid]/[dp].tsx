import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, ReactNode, useState } from 'react';
import { HyperLink, Paragraph } from '../../../components/Article';
import { BallotEditor } from '../../../components/BallotEditor';
import { Container } from '../../../components/Container';
import { Layout } from '../../../components/Layout';

interface Department {
  title: string;
  intro: ReactNode;
}

const departments: Record<number, Department> = {
  1: {
    title: 'TV动画部门',
    intro: (
      <article className="text-text">
        <Paragraph>
          评选范围为2021年内在电视台或者流媒体平台以剧集形式播出过的动画作品。
          跨年份的作品以2021年份内的部分来判断。
        </Paragraph>
        <Paragraph>
          新播出的作品可以参考：
          <HyperLink href="https://zh.wikipedia.org/wiki/日本動畫列表_(2021年)">
            2021年日本动画列表
          </HyperLink>
        </Paragraph>
      </article>
    ),
  },
  2: {
    title: '其他动画部门',
    intro: (
      <article className="text-text">
        <Paragraph>
          评选范围为2021年内以其他形式公开的动画作品。比如剧场版、蓝光、OVA、短片、广告PV等。
          跨年份的作品以2021年份内的部分来判断。也可以以中文字幕发布时间来计算。
        </Paragraph>
        <Paragraph>
          新播出的作品可以参考：
          <HyperLink href="https://zh.wikipedia.org/wiki/日本動畫列表_(2021年)">
            2021年日本动画列表
          </HyperLink>
        </Paragraph>
      </article>
    ),
  },
  3: {
    title: '漫画部门',
    intro: (
      <article className="text-text">
        <Paragraph>
          评选范围为2021年内发表的漫画作品。跨年份的作品以2021年份内的部分来判断。
        </Paragraph>
      </article>
    ),
  },
  4: {
    title: '电子游戏部门',
    intro: (
      <article className="text-text">
        <Paragraph>
          评选范围为2021年内发行的电子游戏作品或者已经发售游戏或者网络游戏的大型资料片。
          如果中文版延后发售，也可以按中文版发售时间计算。
        </Paragraph>
      </article>
    ),
  },
  5: {
    title: '小说部门',
    intro: (
      <article className="text-text">
        <Paragraph>
          评选范围为2021年内公开的小说作品。跨年份的作品以2021年份内的部分来判断。
        </Paragraph>
      </article>
    ),
  },
};

const VoteDepartment: NextPage = () => {
  const router = useRouter();
  const { vid, dp } = router.query;
  if (typeof vid !== 'string' || typeof dp !== 'string') {
    return null;
  }
  let voteID: string = vid;
  let department: number = parseInt(dp);
  const toNext = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/votes/${vid}/${department + 1}`);
  };

  const { title, intro } = departments[department];

  return (
    <Layout>
      <nav className="bg-subtle text-base font-serif pl-4 pr-4">
        <Container>
          <p className="text-xl pt-em pb-em">{`${department}/5: ${title}`}</p>
        </Container>
      </nav>
      <main className="pl-4 pr-4">
        <Container>
          {intro}
          <BallotEditor
            voteID={voteID}
            department={department}
          />
            <button
              className="w-full block bg-subtle text-base pt-1 pb-1 pl-4 pr-4 mt-2 mb-2"
              onClick={toNext}
            >
              <p>下一步</p>
            </button>
        </Container>
      </main>
    </Layout>
  );
};

export default VoteDepartment;
