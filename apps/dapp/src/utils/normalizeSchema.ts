import krbTokenSchema from '@krebitdao/reputation-passport/dist/schemas/krbToken.json';

export interface IProfile {
  background: string;
  picture: string;
  name: string;
  did: string;
  reputation: string | number;
  countFollowers: number;
  countFollowing: number;
  personhood?: {
    discord: {
      length: number;
      credential: Object;
      stamp: Object;
    };
    twitter: {
      length: number;
      credential: Object;
      stamp: Object;
    };
    veriff: {
      length: number;
      credential: Object;
      stamp: Object;
    };
    phone: {
      length: number;
      credential: Object;
      stamp: Object;
    };
  };
}

export const profile = (
  profile: any,
  orbisProfile: any,
  reputation: number | string,
  did: string
) => {
  let currentProfile: IProfile;

  if (profile) {
    currentProfile = {
      did,
      background:
        typeof profile?.background === 'string'
          ? profile?.background
          : typeof profile?.cover === 'string'
          ? profile?.cover
          : orbisProfile?.data?.details?.profile?.cover,
      picture:
        typeof profile?.picture === 'string'
          ? profile?.picture
          : typeof profile?.image === 'string'
          ? profile?.image
          : typeof profile?.pic === 'string'
          ? profile?.pic
          : typeof profile?.photo === 'string'
          ? profile?.photo
          : orbisProfile?.data?.details?.profile?.pfp,
      name:
        typeof profile?.name === 'string'
          ? profile?.name
          : typeof profile?.ensDomain === 'string'
          ? profile?.ensDomain
          : typeof profile?.ensName === 'string'
          ? profile?.ensName
          : typeof profile?.address === 'string'
          ? profile?.address
          : orbisProfile?.data?.details?.metadata?.ensName ||
            orbisProfile?.data?.details?.profile?.username,
      reputation: reputation || 0,
      countFollowers: orbisProfile?.data?.count_followers || 0,
      countFollowing: orbisProfile?.data?.count_following || 0
    };
  } else if (orbisProfile?.data?.did) {
    currentProfile = {
      did,
      background: orbisProfile?.data?.details?.profile?.cover,
      picture: orbisProfile?.data?.details?.profile?.pfp,
      name:
        orbisProfile?.data?.details?.metadata?.ensName ||
        orbisProfile?.data?.details?.profile?.username,
      reputation: reputation || 0,
      countFollowers: orbisProfile?.data?.count_followers || 0,
      countFollowing: orbisProfile?.data?.count_following || 0
    };
  } else {
    currentProfile = {
      did: did,
      background: undefined,
      picture: '/imgs/logos/Krebit.svg',
      name: did.replace(
        `did:pkh:eip155:${
          krbTokenSchema[process.env.NEXT_PUBLIC_NETWORK]?.domain?.chainId
        }:`,
        ''
      ),
      reputation: reputation || 0,
      countFollowers: 0,
      countFollowing: 0
    };
  }

  return currentProfile;
};

export const normalizeSchema = {
  profile
};
