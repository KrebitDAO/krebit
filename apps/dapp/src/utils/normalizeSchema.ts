import { Orbis } from '@orbisclub/orbis-sdk';
import krbTokenSchema from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';

// types
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';

export interface ICredential {
  credential: any;
  stamps: any[];
  skills?: string[];
  isMinted: boolean;
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
  ensDomain?: string;
  unsDomain?: string;
  personhoods?: ICredential[];
  works?: ICredential[];
  communities?: ICredential[];
  skills?: string[];
}

export const profile = async (passport: Passport, orbis: Orbis) => {
  let currentProfile: IProfile;
  const did = passport?.did;

  const orbisProfile = await orbis.getProfile(did);
  const reputation = await passport.getReputation();
  const ensDomain = passport?.ens;
  const unsDomain = passport?.uns;

  if (orbisProfile?.data?.did) {
    currentProfile = {
      did,
      background: orbisProfile?.data?.details?.profile?.cover,
      picture: orbisProfile?.data?.details?.profile?.pfp,
      name:
        orbisProfile?.data?.details?.profile?.username ||
        orbisProfile?.data?.details?.metadata?.ensName,
      description: orbisProfile?.data?.details?.profile?.description,
      reputation: reputation || 0,
      countFollowers: orbisProfile?.data?.count_followers || 0,
      countFollowing: orbisProfile?.data?.count_following || 0,
      ensDomain,
      unsDomain
    };
  } else {
    const profile = await passport.getProfile();

    if (profile) {
      currentProfile = {
        did,
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
        countFollowing: orbisProfile?.data?.count_following || 0,
        ensDomain,
        unsDomain
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
        countFollowing: 0,
        ensDomain,
        unsDomain
      };
    }
  }

  return currentProfile;
};

export const normalizeSchema = {
  profile
};
