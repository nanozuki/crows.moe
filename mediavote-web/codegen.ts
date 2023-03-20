import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../mediavote-api/graph/schema.graphql',
  documents: ['./src/gql/**.ts'],
  ignoreNoDocuments: true,
  generates: {
    'src/gqlgen/': {
      preset: 'client',
      plugins: [],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
