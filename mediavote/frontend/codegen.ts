import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../backend/graph/schema.graphqls',
  documents: ['./src/**/*.tsx', './src/**/*.graphql'],
  ignoreNoDocuments: true,
  generates: {
    'src/graph/': {
      preset: 'client',
      plugins: [],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
