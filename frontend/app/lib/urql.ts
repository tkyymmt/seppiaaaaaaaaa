import { createClient, cacheExchange, fetchExchange } from 'urql';


const client = createClient({
    url: 'http://localhost:3001/graphql', // Nest.jsのGraphQLエンドポイント
    exchanges: [cacheExchange, fetchExchange],
});

export default client;
