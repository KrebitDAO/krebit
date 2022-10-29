import 'isomorphic-fetch';

import * as crypto from 'crypto';

const {
  SERVER_VERIFF_API_URL,
  SERVER_VERIFF_API_TOKEN,
  SERVER_VERIFF_PRIVATE_KEY
} = process.env;

const generateHmacSignature = (payload: any) => {
  if (payload.constructor === Object) {
    payload = JSON.stringify(payload);
  }

  if (payload.constructor !== Buffer) {
    payload = Buffer.from(payload, 'utf8');
  }

  const signature = crypto
    .createHmac('sha256', SERVER_VERIFF_PRIVATE_KEY)
    .update(Buffer.from(payload, 'utf8'))
    .digest('hex')
    .toLowerCase();

  return signature.toLowerCase();
};

export const getVeriffDecision = async (veriffId: string): Promise<any> => {
  try {
    const response = await fetch(
      `${SERVER_VERIFF_API_URL}/sessions/${veriffId}/decision`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-HMAC-SIGNATURE': generateHmacSignature(veriffId),
          'X-AUTH-CLIENT': SERVER_VERIFF_API_TOKEN
        }
      }
    ).then(result => result.json());
    if (response.status == 'fail') throw new Error(response.message);

    return response.verification;
  } catch (error) {
    console.error(error);
    return null;
  }
};
