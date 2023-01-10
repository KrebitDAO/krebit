import 'isomorphic-fetch';
import FormData from 'isomorphic-form-data';

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

  const formData = new FormData();
  formData.append('sender_address', SERVER_HASHMAIL_API_SENDER);
  formData.append('to_address', to.join(','));
  formData.append('subject', subject);
  formData.append('content', content);

  try {
    const response = await fetch(
      `${SERVER_HASHMAIL_API_URL}/dapp/messages/send`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${SERVER_HASHMAIL_API_TOKEN}`
        },
        body: formData
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
