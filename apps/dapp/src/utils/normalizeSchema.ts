import { Orbis } from '@orbisclub/orbis-sdk';
import Passport from '@krebitdao/reputation-passport';

// types
import { Passport as PassportType } from '@krebitdao/reputation-passport/dist/core/Passport';

interface IProps {
  orbis: Orbis;
  passport?: PassportType;
  did?: string;
  reputation?: number;
}

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

const DEFAULT_PICTURE = '/imgs/images/person_outline.svg';
const DEFAULT_NAME = 'Anonymous';

export const profile = async (props: IProps) => {
  let { orbis, passport, did, reputation = 0 } = props;
  let currentProfile: IProfile;
  let ensDomain: string;
  let unsDomain: string;

  if (passport) {
    did = passport.did;
    reputation = await passport.getReputation();
    ensDomain = passport?.ens;
    unsDomain = passport?.uns;
  }

  const orbisProfile = await orbis.getProfile(did);

  if (orbisProfile?.data?.did) {
    currentProfile = {
      did,
      background: orbisProfile?.data?.details?.profile?.cover,
      picture: orbisProfile?.data?.details?.profile?.pfp || DEFAULT_PICTURE,
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
    currentProfile = {
      did,
      background: undefined,
      picture: DEFAULT_PICTURE,
      name:
        did.match(Passport.utils.regexValidations.address)[0] || DEFAULT_NAME,
      description: undefined,
      reputation: reputation || 0,
      countFollowers: 0,
      countFollowing: 0,
      ensDomain,
      unsDomain
    };
  }

  return currentProfile;
};

export const normalizeSchema = {
  profile
};
