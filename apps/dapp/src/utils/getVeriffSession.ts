import 'isomorphic-fetch';

const { NEXT_PUBLIC_VERIFF_API_TOKEN } = process.env;
const { NEXT_PUBLIC_VERIFF_API_URL } = process.env;

const headers = {
  'x-auth-client': NEXT_PUBLIC_VERIFF_API_TOKEN,
  'content-type': 'application/json'
};

export const getVeriffSession = async (payload: any) => {
  try {
    const response = await fetch(`${NEXT_PUBLIC_VERIFF_API_URL}/sessions`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    }).then(result => result.json());
    console.log('veriff session: ', response);
    if (response.status == 'fail') throw new Error(response.message);
    return response.verification;
  } catch (error) {
    console.error(error);

    return null;
  }
};
