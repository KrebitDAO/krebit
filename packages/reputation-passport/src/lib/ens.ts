import 'isomorphic-fetch';

import { ensResolvedAddress, ensDomains } from '../queries/index.js';
import { config } from '../config/index.js';

export interface ClientProps {
  query: string;
  variables: GetProps | ListProps;
}

export interface ListProps {
  first?: number;
  orderBy?: string;
  orderDirection?: string;
  where?: object;
}

export interface GetProps {
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
// ensResolvedAddress from subgraph
const resolveName = async (name: string) => {
  const where = {
    name: name
  };

  //Get ensResolvedAddress from subgraph
  const addresses = await resolvedAddressQuery({
    first: 1,
    orderBy: 'id',
    orderDirection: 'desc',
    where
  });

  return addresses.length > 0 ? addresses[0].resolvedAddress.id : null;
};

// domainNameQuery from subgraph
const lookupAddress = async (address: string) => {
  const domains = await domainNameQuery(address);
  const domain = domains.length > 0 ? domains[0].name : null;
  //console.debug('ENS:', domain);
  return domain;
};

export const ens = {
  client,
  resolveName,
  lookupAddress
};
