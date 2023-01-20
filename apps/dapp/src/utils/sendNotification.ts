import { getAddressFromDid } from '@orbisclub/orbis-sdk/utils';

// types
import { Orbis } from '@orbisclub/orbis-sdk';

interface INofiticationBody {
  subject: string;
  content: string;
  recipients: string[];
}

interface IProps {
  orbis: Orbis;
  authenticatedDID: string;
  body: INofiticationBody;
}

const { NEXT_PUBLIC_NOTIFY_API_URL } = process.env;

const sendMessage = async (
  orbis: Orbis,
  streamId: string,
  body: INofiticationBody
) => {
  let promises = [];

  // send message through orbis
  const sendOrbisMessage = orbis.sendMessage({
    conversation_id: streamId,
    body: body.content
  });
  promises.push(sendOrbisMessage);

  // send message through hashmail
  const { address } = getAddressFromDid(body.recipients[0]);
  const sendHashmailMessage = fetch(NEXT_PUBLIC_NOTIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject: body.subject,
      content: body.content,
      recipients: [address]
    })
  }).then(result => result.json());
  promises.push(sendHashmailMessage);

  return Promise.all(promises);
};

export const sendNotification = (props: IProps) => {
  const { orbis, authenticatedDID, body } = props;

  return Promise.all(
    body.recipients.map(async recipient => {
      try {
        const currentConversations = await orbis.getConversations({
          did: recipient
        });

        if (currentConversations?.data?.length > 0) {
          const conversationsWithSender = currentConversations?.data?.filter(
            conversation => conversation?.recipients.includes(authenticatedDID)
          );
          const conversationWithJustSender = conversationsWithSender?.find(
            conversation => conversation?.recipients?.length === 2
          );

          if (conversationWithJustSender) {
            // This means that the conversation already exists, so we can send the message
            const message = await sendMessage(
              orbis,
              conversationWithJustSender.stream_id,
              {
                subject: body.subject,
                content: body.content,
                recipients: [recipient]
              }
            );
            console.log('new message sent: ', message);
          } else {
            // This means that the recipient has conversations but not with the sender
            const response = await orbis.createConversation({
              recipients: [recipient]
            });

            if (response?.doc) {
              const message = await sendMessage(orbis, response?.doc, {
                subject: body.subject,
                content: body.content,
                recipients: [recipient]
              });
              console.log('new message sent: ', message);
            }
          }
        } else {
          // This means that the recipient does not have any conversation with anyone
          const response = await orbis.createConversation({
            recipients: [recipient]
          });

          if (response?.doc) {
            const message = await sendMessage(orbis, response?.doc, {
              subject: body.subject,
              content: body.content,
              recipients: [recipient]
            });
            console.log('new message sent: ', message);
          }
        }

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    })
  );
};
