import 'isomorphic-fetch';

import { schemas } from '../schemas/index.js';
import {
  verifiableCredentials,
  verifiableCredential,
  erc20Contract,
  credentialRegistries,
  credentialRegistry,
  erc20Balance,
  erc20Balances,
  exploreAccounts,
  totalAccounts
} from '../queries/index.js';
import { config } from '../config/index.js';

export interface ClientProps {
  query: string;
  variables: GetProps | ListProps;
}

export interface ListProps {
  first?: number;
  skip?: number;
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

  const response = await fetch(currentConfig.graphUrl, {
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

  return response.data?.erc20Balances;
};

const erc20BalanceQuery = async (address: string) => {
  const contract = schemas.krbToken[currentConfig.network].address;
  const id = contract.toLowerCase() + '/' + address.toLowerCase();

  if (!id) return;

  const response = await client({
    query: erc20Balance,
    variables: { id }
  });

  return response.data?.erc20Balance;
};

const exploreAccountsQuery = async (props: ListProps) => {
  const response = await client({
    query: exploreAccounts,
    variables: props
  });

  return response.data.accounts;
};

const totalAccountsQuery = async (props: ListProps) => {
  const response = await client({
    query: totalAccounts,
    variables: props
  });

  return response.data.accounts.length;
};

export const graph = {
  client,
  verifiableCredentialsQuery,
  verifiableCredentialQuery,
  erc20ContractQuery,
  credentialRegistriesQuery,
  credentialRegistryQuery,
  erc20BalanceQuery,
  erc20BalancesQuery,
  exploreAccountsQuery,
  totalAccountsQuery
};
