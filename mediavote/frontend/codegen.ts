import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "../backend/graph/schema.graphqls",
  documents: ["./src/gql/**.ts"],
  ignoreNoDocuments: true,
  generates: {
    "src/gqlgen/": {
      preset: "client",
      plugins: [],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
