import 'isomorphic-fetch';

interface IProps {
  to: string[];
  subject: string;
  content: string;
}

const { SERVER_HASHMAIL_API_URL } = process.env;
const { SERVER_HASHMAIL_API_SENDER } = process.env;
const { SERVER_HASHMAIL_API_TOKEN } = process.env;

export const sendMessages = async (props: IProps) => {
  const { to, subject, content } = props;
  try {
    const response = await fetch(
      `${SERVER_HASHMAIL_API_URL}/dapp/messages/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          authorization: `Bearer ${SERVER_HASHMAIL_API_TOKEN}`
        },
        body: new URLSearchParams({
          sender_address: SERVER_HASHMAIL_API_SENDER,
          to_address: to.join(','),
          subject,
          content
        })
      }
    ).then(result => result.json());
    return response;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const hashmail = {
  sendMessages
};
