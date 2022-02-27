import { Container } from './Container';
import Link from 'next/link';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full ">
      <header className="bg-love text-highlight-low font-serif pl-4 pr-4 pt-8 pb-4">
        <Link href="/">
          <a>
            <Container>
              <p>2021年</p>
              <p>{"Programmers' Exodus"}</p>
              <p className="text-3xl font-bold">
                媒体艺术祭 <small>投票</small>
              </p>
            </Container>
          </a>
        </Link>
      </header>
      {children}
    </div>
  );
};
export { Layout };
