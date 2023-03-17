import { clientOpt } from '@gql/init';
import { createClient } from '@urql/core';
import {
  type AnyVariables,
  TypedDocumentNode,
  OperationContext,
} from '@urql/core';

import { type DocumentNode } from 'graphql';

const client = createClient(clientOpt());

async function srvQuery<
  Data = any,
  Variables extends AnyVariables = AnyVariables
>(
  query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
  variables: Variables,
  context?: Partial<OperationContext>
): Promise<Data> {
  const { data, error } = await client
    .query(query, variables, context)
    .toPromise();
  if (error) {
    throw error;
  }
  return data as Data;
}

export { srvQuery };
