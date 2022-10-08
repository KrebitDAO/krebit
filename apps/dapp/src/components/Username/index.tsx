import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';

import { Background, LoadingWrapper, Skills, Wrapper } from './styles';
import { Personhood } from './Personhood';
import { Community } from './Community';
import { Work } from './Work';
import { EditProfile } from './EditProfile';
import { Button } from 'components/Button';
import { Layout } from 'components/Layout';
import { Loading } from 'components/Loading';
import { ConnectWallet } from 'components/ConnectWallet';
import { ShareContentModal } from 'components/ShareContentModal';
import { Share } from 'components/Icons';
import { isValid, normalizeSchema, mergeArray, formatUrlImage } from 'utils';
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
          currentFilter === 'Personhood'
            ? 'content-filter-menu-item-active'
            : ''
        }`}
        onClick={() => onClick('Personhood')}
      >
        Personhood Credentials
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'WorkExperience'
            ? 'content-filter-menu-item-active'
            : ''
        }`}
        onClick={() => onClick('WorkExperience')}
      >
        Work Credentials
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'Community' ? 'content-filter-menu-item-active' : ''
        }`}
        onClick={() => onClick('Community')}
      >
        Community Credentials
      </p>
    </div>
  );
};

export const Username = () => {
  const [status, setStatus] = useState('idle');
  const [profile, setProfile] = useState<IProfile | undefined>();
  const [currentDIDFromURL, setCurrentDIDFromURL] = useState<string>();
  const [currentFilterOption, setCurrentFilterOption] = useState('overview');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareContentOpen, setIsShareContentOpen] = useState(false);
  const { query, push } = useRouter();
  const {
    auth,
    walletInformation: { publicPassport, passport, issuer, orbis },
    walletModal: { openConnectWallet, handleOpenConnectWallet },
    storage
  } = useContext(GeneralContext);
  const windowSize = useWindowSize();
  const isDesktop = windowSize.width >= 1024;
  const isLoading = status === 'idle' || status === 'pending';
  const parentShareContentRef = useRef(null);

  useEffect(() => {
    if (!window) return;
    if (!publicPassport) return;
    if (!query.id) return;

    setStatus('pending');

    const getProfile = async () => {
      try {
        await publicPassport.read((query.id as string).toLowerCase());

        const currentProfile = await normalizeSchema.profile(
          publicPassport,
          orbis
        );

        const currentDIDFromURL = publicPassport.did;
        if (!isValid('did', currentDIDFromURL)) setStatus('rejected');

        setProfile({
          ...currentProfile,
          skills: []
        });
        setCurrentDIDFromURL(currentDIDFromURL);
        setStatus('resolved');
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getProfile();
  }, [publicPassport, query.id]);

  const handleProfile = (profile: IProfile) => {
    setProfile(profile);
  };

  const handleFilterOption = (value: string) => {
    setProfile({ ...profile, skills: [] });
    setCurrentFilterOption(value);
  };

  const handleEditProfile = () => {
    if (!auth?.isAuthenticated) return;

    setIsEditProfileOpen(prevState => !prevState);
  };

  const handleIsShareContentOpen = async () => {
    const currentUrl = window.location.href;

    if (!isDesktop && window?.navigator?.share) {
      await window.navigator.share({
        title: 'Krebit Reputation credentials',
        text: 'Krebit Reputation credentials',
        url: currentUrl
      });
      return;
    }

    setIsShareContentOpen(prevState => !prevState);
  };

  const handleOpenDomainPage = async (domain: string) => {
    window.open(`/${domain}`);
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
      {isEditProfileOpen && (
        <EditProfile
          profile={profile}
          onClose={handleEditProfile}
          passport={passport}
          orbis={orbis}
          storage={storage}
        />
      )}
      <Layout>
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <Wrapper
            profilePicture={
              formatUrlImage(profile?.picture) || '/imgs/logos/Krebit.svg'
            }
            isCurrentProfile={currentDIDFromURL !== auth?.did}
          >
            <div className="profile-container">
              <Background image={formatUrlImage(profile?.background)} />
              <div className="profile">
                <div className="profile-photo"></div>
                <div className="profile-info">
                  <div className="profile-info-naming-container">
                    <div className="profile-info-naming-header">
                      <div className="profile-info-naming">
                        <span className="profile-info-name">
                          {profile.name}
                        </span>{' '}
                        <span className="profile-info-token">
                          KRB {profile.reputation}
                        </span>
                      </div>
                      <div className="profile-info-domains">
                        {profile.ensDomain && (
                          <span
                            className="profile-info-domain"
                            onClick={() =>
                              handleOpenDomainPage(profile.ensDomain)
                            }
                          >
                            {profile.ensDomain}
                          </span>
                        )}
                        {profile.unsDomain && (
                          <span
                            className="profile-info-domain"
                            onClick={() =>
                              handleOpenDomainPage(profile.unsDomain)
                            }
                          >
                            {profile.unsDomain}
                          </span>
                        )}
                      </div>
                    </div>
                    {profile.description && (
                      <p className="profile-info-description">
                        {profile.description}
                      </p>
                    )}
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
                <div className="profile-buttons">
                  {currentDIDFromURL !== auth?.did ? (
                    <>
                      <div className="profile-buttons-container">
                        <Button text="Follow" onClick={() => {}} />
                      </div>
                      <div className="profile-buttons-container">
                        <Button
                          text="Send Message"
                          onClick={handleSendMessage}
                          styleType="border"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="profile-buttons-container">
                        <Button
                          text="Edit profile"
                          onClick={handleEditProfile}
                          styleType="border"
                        />
                      </div>
                    </>
                  )}
                  <div
                    className="profile-buttons-rounded"
                    ref={parentShareContentRef}
                  >
                    <Button
                      icon={<Share />}
                      onClick={handleIsShareContentOpen}
                      styleType="border-rounded"
                    />
                  </div>
                  {isShareContentOpen && (
                    <ShareContentModal
                      customText={`${profile.name}'s profile on @KrebitID`}
                      parentRef={parentShareContentRef}
                      onClose={handleIsShareContentOpen}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="content-container">
              <div className="content-left">
                <Skills>
                  <div className="skills-header">
                    <p className="skills-header-text">Skills</p>
                  </div>
                  {profile.skills === undefined ? (
                    <div className="skills-box-loading">
                      <Loading type="skeleton" />
                    </div>
                  ) : profile.skills?.length === 0 ? (
                    <div className="skills-not-elements">
                      <img
                        src="/imgs/images/skills_not_found.png"
                        className="skills-not-elements-image"
                        width={243}
                        height={51}
                      />
                      <p className="skills-not-elements-title">
                        No skills yet.
                      </p>
                      <p className="skills-not-elements-description">
                        Explore skills list
                      </p>
                    </div>
                  ) : (
                    <div className="skills-box">
                      {mergeArray(profile.skills).map((item, index) => (
                        <div className="skills-box-item" key={index}>
                          <p className="skills-box-item-text">
                            {item[0]}{' '}
                            {parseInt(item[1]) === 1 ? '' : '(' + item[1] + ')'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Skills>
                <FilterMenu
                  currentFilter={currentFilterOption}
                  isHidden={isDesktop}
                  onClick={handleFilterOption}
                />
                <Personhood
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  passport={passport}
                  publicPassport={publicPassport}
                  issuer={issuer}
                  currentFilterOption={currentFilterOption}
                  onFilterOption={handleFilterOption}
                  isHidden={currentFilterOption !== 'overview'}
                  handleProfile={handleProfile}
                />
              </div>
              <div className="content-right">
                <FilterMenu
                  currentFilter={currentFilterOption}
                  isHidden={!isDesktop}
                  onClick={handleFilterOption}
                />
                <Personhood
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  passport={passport}
                  publicPassport={publicPassport}
                  issuer={issuer}
                  currentFilterOption={currentFilterOption}
                  onFilterOption={handleFilterOption}
                  isHidden={currentFilterOption !== 'Personhood'}
                  handleProfile={handleProfile}
                />
                <Work
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  passport={passport}
                  publicPassport={publicPassport}
                  issuer={issuer}
                  currentFilterOption={currentFilterOption}
                  onFilterOption={handleFilterOption}
                  isHidden={
                    currentFilterOption !== 'overview' &&
                    currentFilterOption !== 'WorkExperience'
                  }
                  handleProfile={handleProfile}
                />
                <Community
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  passport={passport}
                  publicPassport={publicPassport}
                  issuer={issuer}
                  currentFilterOption={currentFilterOption}
                  onFilterOption={handleFilterOption}
                  isHidden={
                    currentFilterOption !== 'overview' &&
                    currentFilterOption !== 'Community'
                  }
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
