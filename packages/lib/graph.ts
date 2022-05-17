import { createClient } from 'urql';

const { APP_GRAPH_URL } = process.env;

const client = createClient({
  url: APP_GRAPH_URL,
});

export { client };
