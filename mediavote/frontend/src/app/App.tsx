"use client";

import { clientOpt } from "@gql/init";
import { ReactNode } from "react";
import { SSRProvider } from "react-aria";
import { createClient, Provider as UrqlProvider } from "urql";

interface AppProps {
  children: ReactNode;
}

const client = createClient(clientOpt());

export default function App({ children }: AppProps) {
  return (
    <SSRProvider>
      <UrqlProvider value={client}>{children}</UrqlProvider>
    </SSRProvider>
  );
}
