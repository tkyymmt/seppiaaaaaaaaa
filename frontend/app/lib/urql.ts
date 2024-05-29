import { createClient, cacheExchange, fetchExchange } from 'urql';

// FIXME: 本来は.envなどで管理すべき
const HASURA_GRAPHQL_API_URL = 'http://localhost:8080/v1/graphql';
const HASURA_GRAPHQL_ADMIN_SECRET = 'adminsecret';

const hasuraClient = createClient({
  url: HASURA_GRAPHQL_API_URL,
  fetchOptions: () => {
    return {
      headers: {
        'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
      },
    };
  },
  exchanges: [cacheExchange, fetchExchange],
});

export { hasuraClient };
