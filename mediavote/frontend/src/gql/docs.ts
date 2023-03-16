import { graphql } from "@gqlgen";
import { GraphQLBoolean } from "graphql";

const getNominations = graphql(`
  query GetNominations($dept: Department) {
    nominations(department: $dept) {
      id
      workName
      work {
        nameCN
        nameOrigin
      }
    }
  }
`);

const addNomination = graphql(`
  mutation AddNomination($dept: Department!, $work: String!) {
    postNomination(department: $dept, work: $work) {
      id
      workName
      work {
        nameCN
        nameOrigin
      }
    }
  }
`);

export { getNominations, addNomination };
