import { DIDDataStore } from '@glazed/did-datastore';
import { PrivateKey, Users, Status } from '@textile/hub';

export interface ILastMessage {
  id: string;
  subject: any;
  text: any;
  createdAt: number;
  ed25519: string;
  did: any;
  address: any;
  name: any;
  readAt: number;
  imageIPFS: any;
  attachedClaims: any;
  attachedVC: any;
  vcId: any;
  deal: any;
}

const MESSAGES_LIMIT = parseInt(process.env.SERVER_MESSAGES_LIMIT, 10);

export const getLastMessage = async (
  ed25519: PrivateKey,
  userAPI: Users,
  idx: DIDDataStore
): Promise<ILastMessage[]> => {
  try {
    const response = await userAPI.listInboxMessages({
      limit: MESSAGES_LIMIT,
      ascending: false,
      status: Status.UNREAD,
    });

    if (response.length === 0) return [];

    const messages = await Promise.all(
      response.map(async res => {
        const bytes = await ed25519.decrypt(res.body);
        const body = JSON.parse(new TextDecoder().decode(bytes));

        return {
          id: res.id,
          subject: body.subject,
          text: body.text,
          createdAt: res.createdAt,
          ed25519: res.from,
          did: body.from,
          address: body.address,
          name: await idx
            .get('basicProfile', body.from)
            .then(basicProfile =>
              basicProfile && basicProfile.name
                ? basicProfile.name
                : body.from.substring(0, 10) +
                  '...' +
                  body.from.substring(body.from.length - 4)
            ),
          readAt: res.readAt,
          imageIPFS: body.imageIPFS,
          attachedClaims: body.attachedClaims,
          attachedVC: body.attachedVC,
          vcId: body.vcId,
          deal: body.deal,
        };
      })
    );

    return messages;
  } catch (error) {
    console.error('Failure retrieving messages:', error);

    return [];
  }
};
