import urql from 'urql';

import {
  verifiableCredentials,
  verifiableCredential,
  erc20Contract,
  credentialRegistries,
  credentialRegistry,
  erc20Balance,
  erc20Balances,
} from './queries/index.mjs';

interface ListProps {
  first?: number;
  orderBy?: string;
  orderDirection?: string;
  where?: object;
}

interface GetProps {
  id: string;
}

const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URL;

const client = urql.createClient({
  url: GRAPH_URL!,
});

const verifiableCredentialsQuery = async (props: ListProps) => {
  const { first, orderBy, orderDirection, where } = props;

  const response = await client
    .query(verifiableCredentials, { first, orderBy, orderDirection, where })
    .toPromise();

  return response;
};

const verifiableCredentialQuery = async (props: GetProps) => {
  const { id } = props;

  const response = await client.query(verifiableCredential, { id }).toPromise();

  return response;
};

const erc20ContractQuery = async (props: ListProps & GetProps) => {
  const { id, orderBy, orderDirection, where } = props;

  const response = await client
    .query(erc20Contract, { id, orderBy, orderDirection, where })
    .toPromise();

  return response;
};

const credentialRegistriesQuery = async (props: ListProps) => {
  const { first, orderBy, orderDirection, where } = props;

  const response = await client
    .query(credentialRegistries, { first, orderBy, orderDirection, where })
    .toPromise();

  return response;
};

const credentialRegistryQuery = async (props: GetProps) => {
  const { id } = props;

  const response = await client.query(credentialRegistry, { id }).toPromise();

  return response;
};

const erc20BalancesQuery = async (props: ListProps) => {
  const { first, orderBy, orderDirection, where } = props;

  const response = await client
    .query(erc20Balances, { first, orderBy, orderDirection, where })
    .toPromise();

  return response;
};

const erc20BalanceQuery = async (props: GetProps) => {
  const { id } = props;

  const response = await client.query(erc20Balance, { id }).toPromise();

  return response;
};

export {
  client,
  verifiableCredentialsQuery,
  verifiableCredentialQuery,
  erc20ContractQuery,
  credentialRegistriesQuery,
  credentialRegistryQuery,
  erc20BalanceQuery,
  erc20BalancesQuery,
};
