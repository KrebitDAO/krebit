import 'isomorphic-fetch';

import { ensResolvedAddress, ensDomains } from '../queries';
import { config } from '../config';

interface ClientProps {
  query: string;
  variables: GetProps | ListProps;
}

interface ListProps {
  first?: number;
  orderBy?: string;
  orderDirection?: string;
  where?: object;
}

interface GetProps {
  id: string;
}

const currentConfig = config.get();

const client = async (props: ClientProps) => {
  const { query, variables } = props;

  const response = await fetch(currentConfig.ensGraphUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  });
  const json = await response.json();

  return json;
};

const resolvedAddressQuery = async (props: ListProps) => {
  const response = await client({
    query: ensResolvedAddress,
    variables: props
  });

  return response.data.domains;
};

const domainNameQuery = async (address: string) => {
  const id = address.toLowerCase();

  const response = await client({
    query: ensDomains,
    variables: { id }
  });

  return response.data?.account ? response.data.account.domains : [];
};

export const ens = {
  client,
  resolvedAddressQuery,
  domainNameQuery
};
