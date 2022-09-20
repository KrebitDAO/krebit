import { Orbis } from '@orbisclub/orbis-sdk';
import { Passport } from '@krebitdao/reputation-passport/dist/core';
import krbTokenSchema from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';

export interface ICredential {
  credential: any;
  stamps: any[];
}

export interface IProfile {
  did: string;
  background: string;
  picture: string;
  name: string;
  description: string;
  reputation: string | number;
  countFollowers: number;
  countFollowing: number;
  personhoods?: ICredential[];
  works?: ICredential[];
}

export const profile = async (passport: Passport, orbis: Orbis) => {
  let currentProfile: IProfile;
  const did = passport?.did;

  const orbisProfile = await orbis.getProfile(did);
  const reputation = await passport.getReputation();

  if (orbisProfile?.data?.did) {
    currentProfile = {
      did,
      background: orbisProfile?.data?.details?.profile?.background,
      picture: orbisProfile?.data?.details?.profile?.pfp,
      name:
        orbisProfile?.data?.details?.metadata?.ensName ||
        orbisProfile?.data?.details?.profile?.username,
      description: orbisProfile?.data?.details?.profile?.description,
      reputation: reputation || 0,
      countFollowers: orbisProfile?.data?.count_followers || 0,
      countFollowing: orbisProfile?.data?.count_following || 0
    };
  } else {
    const profile = await passport.getProfile();

    if (profile) {
      currentProfile = {
        did,
        // TODO: THESE IMAGES MIGHT BE IPFS FILES, WHAT CAN WE DO?
        background: profile?.background?.original?.src,
        picture: profile?.image?.original?.src,
        name:
          profile?.name ||
          did.replace(
            `did:pkh:eip155:${
              krbTokenSchema[process.env.NEXT_PUBLIC_NETWORK]?.domain?.chainId
            }:`,
            ''
          ),
        description: profile?.description,
        reputation: reputation || 0,
        countFollowers: orbisProfile?.data?.count_followers || 0,
        countFollowing: orbisProfile?.data?.count_following || 0
      };
    } else {
      currentProfile = {
        did,
        background: undefined,
        picture: '/imgs/images/person_outline.svg',
        name: did.replace(
          `did:pkh:eip155:${
            krbTokenSchema[process.env.NEXT_PUBLIC_NETWORK]?.domain?.chainId
          }:`,
          ''
        ),
        description: undefined,
        reputation: reputation || 0,
        countFollowers: 0,
        countFollowing: 0
      };
    }
  }

  return currentProfile;
};

export const normalizeSchema = {
  profile
};
