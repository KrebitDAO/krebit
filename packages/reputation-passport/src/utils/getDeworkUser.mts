import 'isomorphic-fetch';

import { config } from '../config/index.mjs';

interface Props {
  address: string;
}

const { DEWORK_URL } = config;

export const getDeworkUser = async (props: Props) => {
  const { address } = props;

  try {
    const response = await fetch(`${DEWORK_URL}/${address}`).then(result =>
      result.json()
    );
    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
