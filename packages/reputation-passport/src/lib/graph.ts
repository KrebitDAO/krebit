import 'isomorphic-fetch';

import { krbToken } from '../schemas';
import { config } from '../config';
import {
  verifiableCredentials,
  verifiableCredential,
  erc20Contract,
  credentialRegistries,
  credentialRegistry,
  erc20Balance,
  erc20Balances
} from '../queries';

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

const client = async (props: ClientProps) => {
  const { query, variables } = props;

  const response = await fetch(config.GRAPH_URL, {
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

const verifiableCredentialsQuery = async (props: ListProps) => {
  const response = await client({
    query: verifiableCredentials,
    variables: props
  });

  return response.data.verifiableCredentials;
};

const verifiableCredentialQuery = async (props: GetProps) => {
  const response = await client({
    query: verifiableCredential,
    variables: props
  });

  return response.data.verifiableCredentials;
};

const erc20ContractQuery = async (props: ListProps & GetProps) => {
  const response = await client({
    query: erc20Contract,
    variables: props
  });

  return response.data.erc20Contract;
};

const credentialRegistriesQuery = async (props: ListProps) => {
  const response = await client({
    query: credentialRegistries,
    variables: props
  });

  return response.data.credentialRegistries;
};

const credentialRegistryQuery = async (props: GetProps) => {
  const response = await client({
    query: credentialRegistry,
    variables: props
  });

  return response.data.credentialRegistry;
};

const erc20BalancesQuery = async (props: ListProps) => {
  const response = await client({
    query: erc20Balances,
    variables: props
  });

  return response.data.erc20Balances;
};

const erc20BalanceQuery = async (address: string) => {
  const contract = krbToken[config.NETWORK].address;
  const id = contract.toLowerCase() + '/' + address.toLowerCase();

  const response = await client({
    query: erc20Balance,
    variables: { id }
  });

  return response.data.erc20Balance;
};

export const graph = {
  client,
  verifiableCredentialsQuery,
  verifiableCredentialQuery,
  erc20ContractQuery,
  credentialRegistriesQuery,
  credentialRegistryQuery,
  erc20BalanceQuery,
  erc20BalancesQuery
};