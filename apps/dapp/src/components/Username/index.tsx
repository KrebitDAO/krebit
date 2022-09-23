import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';

import { Background, LoadingWrapper, Skills, Wrapper } from './styles';
import { Personhood } from './Personhood';
import { Community } from './Community';
import { Work } from './Work';
import { Button } from 'components/Button';
import { Layout } from 'components/Layout';
import { Loading } from 'components/Loading';
import { ConnectWallet } from 'components/ConnectWallet';
import {
  getIssuers,
  sortByDate,
  isValid,
  getDID,
  normalizeSchema,
  mergeArray
} from 'utils';
import { useWindowSize } from 'hooks';
import { GeneralContext } from 'context';

// types
import { IProfile } from 'utils/normalizeSchema';

interface IFilterMenuProps {
  currentFilter: string;
  isHidden: boolean;
  onClick: (value: string) => void;
}

const FilterMenu = (props: IFilterMenuProps) => {
  const { currentFilter, isHidden, onClick } = props;

  return (
    <div
      className={`content-filter-menu ${
        isHidden ? 'content-filter-menu-hidden' : ''
      }`}
    >
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'overview' ? 'content-filter-menu-item-active' : ''
        }`}
        onClick={() => onClick('overview')}
      >
        Overview
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'community' ? 'content-filter-menu-item-active' : ''
        }`}
        onClick={() => onClick('community')}
      >
        Community Credentials
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'work' ? 'content-filter-menu-item-active' : ''
        }`}
        onClick={() => onClick('work')}
      >
        Work Credentials
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'personhood'
            ? 'content-filter-menu-item-active'
            : ''
        }`}
        onClick={() => onClick('personhood')}
      >
        Personhood Credentials
      </p>
    </div>
  );
};

export const Username = () => {
  const [status, setStatus] = useState('idle');
  const [profile, setProfile] = useState<IProfile | undefined>();
  const [currentDIDFromURL, setCurrentDIDFromURL] = useState<string>();
  const [currentFilterOption, setCurrentFilterOption] = useState('overview');
  const { query, push } = useRouter();
  const {
    auth,
    walletInformation: { publicPassport, passport, issuer, orbis },
    walletModal: { openConnectWallet, handleOpenConnectWallet }
  } = useContext(GeneralContext);
  const windowSize = useWindowSize();
  const isDesktop = windowSize.width >= 1024;
  const isLoading = status === 'idle' || status === 'pending';

  useEffect(() => {
    if (!window) return;
    if (!publicPassport) return;
    if (!query.id) return;

    setStatus('pending');

    const isValidID = isValid('all', query.id as string);

    if (!isValidID) {
      setStatus('rejected');
      return;
    }

    const getProfile = async () => {
      try {
        await publicPassport.read((query.id as string).toLowerCase());

        let currentProfile = await normalizeSchema.profile(
          publicPassport,
          orbis
        );

        const currentDIDFromURL = await getDID(
          query.id as string,
          publicPassport
        );

        setCurrentDIDFromURL(currentDIDFromURL);

        const currentPersonhoodCredentials = await publicPassport.getCredentials(
          undefined,
          'personhood'
        );
        const currentWorkCredentials = await publicPassport.getCredentials(
          undefined,
          'workExperience'
        );
        const currentCommunityCredentials = await publicPassport.getCredentials(
          undefined,
          'community'
        );

        if (currentPersonhoodCredentials?.length === 0) {
          currentProfile = {
            ...currentProfile,
            personhoods: []
          };
        }

        if (currentWorkCredentials?.length === 0) {
          currentProfile = {
            ...currentProfile,
            works: []
          };
        }

        if (currentCommunityCredentials?.length === 0) {
          currentProfile = {
            ...currentProfile,
            communities: []
          };
        }

        let currentSkills = [];

        const currentPersonhoodsPromise = Promise.all(
          currentPersonhoodCredentials.map(async credential => {
            const stamps = await publicPassport.getStamps({
              type: 'personhood',
              claimId: credential.id
            });
            const visualInformation = getIssuers('personhood').find(issuer =>
              credential.type.includes(issuer.credentialType)
            );
            const claimValue = await publicPassport.getClaimValue(credential);
            delete claimValue.proofs;
            const customCredential = {
              ...credential,
              visualInformation: {
                ...visualInformation,
                isEncryptedByDefault: !!claimValue?.encrypted
              },
              value: claimValue
            };
            currentSkills = currentSkills.concat(credential.type);
            return {
              credential: customCredential,
              stamps
            };
          })
        ).then(personhoods =>
          personhoods.sort((a, b) =>
            sortByDate(
              a.credential.issuanceDate,
              b.credential.issuanceDate,
              'des'
            )
          )
        );

        const currentWorksPromise = Promise.all(
          currentWorkCredentials.map(async credential => {
            const stamps = await publicPassport.getStamps({
              type: 'workExperience',
              claimId: credential.id
            });
            const visualInformation = getIssuers(
              'workExperience'
            ).find(issuer => credential.type.includes(issuer.credentialType));
            const claimValue = await publicPassport.getClaimValue(credential);
            delete claimValue.proofs;
            const customCredential = {
              ...credential,
              visualInformation: {
                ...visualInformation,
                isEncryptedByDefault: !!claimValue?.encrypted
              },
              value: claimValue
            };
            currentSkills = currentSkills.concat(credential.type);
            return {
              credential: customCredential,
              stamps
            };
          })
        ).then(works =>
          works.sort((a, b) =>
            sortByDate(
              a.credential.issuanceDate,
              b.credential.issuanceDate,
              'des'
            )
          )
        );

        const currentCommunitiesPromise = Promise.all(
          currentCommunityCredentials.map(async credential => {
            const stamps = await publicPassport.getStamps({
              type: 'community',
              claimId: credential.id
            });
            const visualInformation = getIssuers('community').find(issuer =>
              credential.type.includes(issuer.credentialType)
            );
            const claimValue = await publicPassport.getClaimValue(credential);
            delete claimValue.proofs;
            const customCredential = {
              ...credential,
              visualInformation: {
                ...visualInformation,
                isEncryptedByDefault: !!claimValue?.encrypted
              },
              value: claimValue
            };
            currentSkills = currentSkills.concat(credential.type);
            return {
              credential: customCredential,
              stamps
            };
          })
        ).then(works =>
          works.sort((a, b) =>
            sortByDate(
              a.credential.issuanceDate,
              b.credential.issuanceDate,
              'des'
            )
          )
        );

        const [
          currentPersonhoods,
          currentWorks,
          currentCommunities
        ] = await Promise.all([
          currentPersonhoodsPromise,
          currentWorksPromise,
          currentCommunitiesPromise
        ]);

        currentProfile = {
          ...currentProfile,
          personhoods: currentPersonhoods,
          works: currentWorks,
          communities: currentCommunities,
          skills: mergeArray(currentSkills)
        };

        setProfile(currentProfile);
        setStatus('resolved');
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getProfile();
  }, [publicPassport, query.id, currentDIDFromURL]);

  const handleProfile = (profile: IProfile) => {
    setProfile(profile);
  };

  const handleFilterOption = (value: string) => {
    setCurrentFilterOption(value);
  };

  const handleSendMessage = () => {
    if (!auth?.isAuthenticated) {
      handleOpenConnectWallet();
      return;
    }

    const isValidID = isValid('did', query.id as string);

    if (!isValidID) {
      setStatus('rejected');
      return;
    }

    push(`/messages/${query.id}`);
  };

  if (status === 'rejected') {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <ConnectWallet
        isOpen={openConnectWallet}
        onClose={handleOpenConnectWallet}
      />
      <Layout>
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <Wrapper
            profilePicture={profile.picture || '/imgs/logos/Krebit.svg'}
            isCurrentProfile={currentDIDFromURL === auth?.did}
          >
            <div className="profile-container">
              <Background image={profile.background} />
              <div className="profile">
                <div className="profile-photo"></div>
                <div className="profile-info">
                  <div className="profile-info-naming">
                    <p className="profile-info-name">{profile.name}</p>{' '}
                    <span className="profile-info-token">
                      KRB {profile.reputation}
                    </span>
                  </div>
                  <div className="profile-info-follow">
                    <span className="profile-info-followers">
                      {profile.countFollowers}{' '}
                      <span className="profile-info-followers-text">
                        Followers
                      </span>
                    </span>
                    <span className="profile-info-follow-dot"></span>
                    <span className="profile-info-followers">
                      {profile.countFollowing}{' '}
                      <span className="profile-info-followers-text">
                        Following
                      </span>
                    </span>
                  </div>
                </div>
                {currentDIDFromURL !== auth?.did && (
                  <div className="profile-buttons">
                    <Button text="Follow" onClick={() => {}} />
                    <Button
                      text="Send Message"
                      onClick={handleSendMessage}
                      styleType="border"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="content-container">
              <div className="content-left">
                <Skills>
                  <div className="skills-header">
                    <p className="skills-header-text">Skills</p>
                  </div>
                  <div className="skills-box">
                    {profile.skills.map((item, index) => (
                      <div className="skills-box-item" key={index}>
                        <p className="skills-box-item-text">
                          {item[0]}{' '}
                          {parseInt(item[1]) === 1 ? '' : '(' + item[1] + ')'}
                        </p>
                      </div>
                    ))}
                  </div>
                </Skills>
                <FilterMenu
                  currentFilter={currentFilterOption}
                  isHidden={isDesktop}
                  onClick={handleFilterOption}
                />
                <Personhood
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  personhoods={profile.personhoods}
                  passport={passport}
                  issuer={issuer}
                  handleProfile={handleProfile}
                />
              </div>
              <div className="content-right">
                <FilterMenu
                  currentFilter={currentFilterOption}
                  isHidden={!isDesktop}
                  onClick={handleFilterOption}
                />
                <Work
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  works={profile.works}
                  passport={passport}
                  issuer={issuer}
                  handleProfile={handleProfile}
                />
                <Community
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  communities={profile.communities}
                  passport={passport}
                  issuer={issuer}
                  handleProfile={handleProfile}
                />
              </div>
            </div>
          </Wrapper>
        )}
      </Layout>
    </>
  );
};
