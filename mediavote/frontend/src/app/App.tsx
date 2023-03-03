'use client';

import { ReactNode } from 'react';
import { SSRProvider } from 'react-aria';

interface AppProps {
  children: ReactNode;
}

export default function App({ children }: AppProps) {
  return <SSRProvider>{children}</SSRProvider>;
}
