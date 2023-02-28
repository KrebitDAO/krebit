import Krebit from '@krebitdao/reputation-passport';
import { getAddressFromDid } from '@orbisclub/orbis-sdk/utils';

// types
import { Orbis } from '@orbisclub/orbis-sdk';

interface INofiticationBody {
  subject: string;
  content: string;
  recipients: string[];
  html?: string;
}

interface IProps {
  orbis: Orbis;
  authenticatedDID: string;
  body: INofiticationBody;
}

const { NEXT_PUBLIC_NOTIFY_API_URL } = process.env;

const sendMessage = async (
  body: INofiticationBody,
  orbis?: Orbis,
  streamId?: string
) => {
  let promises = [];

  // send message through orbis
  if (orbis && streamId) {
    const sendOrbisMessage = orbis.sendMessage({
      conversation_id: streamId,
      body: body.content
    });
    promises.push(sendOrbisMessage);
  }

  // send message through hashmail
  let value: string;

  if (body.recipients[0].includes('@')) {
    value = body.recipients[0];
  } else {
    const { address } = getAddressFromDid(body.recipients[0]);
    value = address;
  }

  const sendHashmailMessage = fetch(NEXT_PUBLIC_NOTIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subject: body.subject,
      content: body?.html ? body?.html : body?.content,
      recipients: [value]
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
        if (recipient.includes('@')) {
          const message = await sendMessage({
            subject: body.subject,
            content: body.content,
            recipients: [recipient]
          });

          console.log('new message sent: ', message);
          return true;
        }

        if (!recipient.startsWith('0x')) return false;

        const defaultDID = await Krebit.lib.orbis.getDefaultDID(recipient);
        const recipientDID = defaultDID
          ? defaultDID
          : `did:pkh:eip155:1:${recipient}`;

        const currentConversations = await orbis.getConversations({
          did: recipientDID
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
              {
                subject: body.subject,
                content: body.content,
                recipients: [recipientDID]
              },
              orbis,
              conversationWithJustSender.stream_id
            );
            console.log('new message sent: ', message);
          } else {
            // This means that the recipient has conversations but not with the sender
            const response = await orbis.createConversation({
              recipients: [recipientDID]
            });

            if (response?.doc) {
              const message = await sendMessage(
                {
                  subject: body.subject,
                  content: body.content,
                  recipients: [recipientDID]
                },
                orbis,
                response?.doc
              );
              console.log('new message sent: ', message);
            }
          }
        } else {
          // This means that the recipient does not have any conversation with anyone
          const response = await orbis.createConversation({
            recipients: [recipientDID]
          });

          if (response?.doc) {
            const message = await sendMessage(
              {
                subject: body.subject,
                content: body.content,
                recipients: [recipientDID]
              },
              orbis,
              response?.doc
            );
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
