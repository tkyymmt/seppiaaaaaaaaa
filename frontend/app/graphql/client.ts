import { gql } from 'urql';

export const GET_CLIENTS = gql`
  query {
    clients {
      id
      name
      email
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation($name: String!, $email: String!) {
    createClient(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;
