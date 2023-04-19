import type { MDXComponents } from 'mdx/types';
import { HTMLAttributes } from 'react';

export function useMDXComponents(components: MDXComponents) {
  return {
    h1: ({ children }: HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-2xl font-bold">{children}</h1>
    ),
    ...components,
  };
}
