import Link from 'next/link';

interface ContainerProps {
  children: React.ReactNode;
}

const Container = (props: ContainerProps) => {
  return (
    <div className="w-full max-w-screen-sm ml-auto mr-auto">
      {props.children}
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <header className="bg-love text-highlight-low font-serif pl-4 pr-4 pt-8 pb-8">
        <Link href="/">
          <Container>
            <p>{"Programmers' Exodus"}</p>
            <p className="text-3xl font-bold">媒体艺术祭</p>
          </Container>
        </Link>
      </header>
      <main>
        <Container>
          <p>
            2021年 <small>获奖作品</small>
          </p>
          <p>
            2022年 <small>提名</small>
          </p>
        </Container>
      </main>
    </div>
  );
}
