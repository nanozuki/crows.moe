import { graphql } from '@gqlgen';

const getNominations = graphql(`
  query GetNominations($dept: Department!) {
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
  mutation AddNomination($dept: Department!, $workName: String!) {
    postNomination(department: $dept, workName: $workName) {
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
