import { gql } from 'urql';

export const GET_CLIENTS= gql`
  query {
    clients {
      id
      name
      email
    }
  }
`;

export const CREATE_CLIENT_HASURA = gql`
  mutation CreateClient($name: String!, $email: String!) {
    insert_clients(
      objects: {
        name: $name,
        email: $email,
      }
    ) {
      returning {
        id
        name
        email
      }
    }
  }
`;

export const CREATE_CLIENTS_HASURA = gql`
  mutation UpsertClients($clients: [clients_insert_input!]!) {
    insert_clients(
      objects: $clients
      on_conflict: {
        constraint: clients_name_key
        update_columns: [email]
      }
    ) {
      returning {
        id
        name
        email
      }
    }
  }
`;


export const UPDATE_CLIENT_HASURA = gql`
  mutation UpdateClient($id: Int!, $name: String!, $email: String!) {
    update_clients(
      where: { id: { _eq: $id } },
      _set: { name: $name, email: $email }
    ) {
      returning {
        id
        name
        email
      }
    }
  }
`;

export const DELETE_CLIENT_HASURA = gql`
  mutation DeleteClient($id: Int!) {
    delete_clients(
      where: { id: { _eq: $id } }
    ) {
      returning {
        id
        name
        email
      }
    }
  }
`;

// export const CREATE_CLIENT_NEST = gql`
//   mutation($name: String!, $email: String!) {
//     createClient(name: $name, email: $email) {
//       id
//       name
//       email
//     }
//   }
// `;
//  clients {
//         id
//         name
//         email
//       }

export const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

export const CREATE_CATEGORY_HASURA = gql`
  mutation CreateCategory($name: String!) {
    insert_categories(
      objects: {name: $name}
    ) {
      returning {
        id
        name
      }
    }
  }
`;

export const UPDATE_CATEGORY_HASURA = gql`
  mutation UpdateCategory($id: Int!, $name: String!) {
    update_categories(
      where: { id: { _eq: $id } },
      _set: { name: $name }
    ) {
      returning {
        id
        name
      }
    }
  }
`;

export const DELETE_CATEGORY_HASURA = gql`
  mutation DeleteCategory($id: Int!) {
    delete_categories(
      where: { id: { _eq: $id } }
    ) {
      returning {
        id
        name
      }
    }
  }
`;