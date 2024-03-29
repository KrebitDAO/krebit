import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import dynamic from 'next/dynamic';
import Krebit from '@krebitdao/reputation-passport';
import { getAddressFromDid } from '@orbisclub/orbis-sdk/utils';

import {
  Background,
  LoadingWrapper,
  QuestionModalText,
  Skills,
  Wrapper,
  Summary,
  Payments,
  AvrStars
} from './styles';
import { Personhood } from './Personhood';
import { Community } from './Community';
import { Work } from './Work';
import { Activity } from './Activity';
import { EditProfile } from './EditProfile';
import { Issue } from './Issue';
import { Review } from './Review';
import { Button } from 'components/Button';
import { Layout } from 'components/Layout';
import { Loading } from 'components/Loading';
import { ShareContentModal } from 'components/ShareContentModal';
import { Share, SmartToy, SystemUpdateAlt } from 'components/Icons';
import { QuestionModal } from 'components/QuestionModal';
import { Rating } from 'components/Rating';
import { HelpTooltip } from 'components/HelpTooltip';
import {
  isValid,
  normalizeSchema,
  formatUrlImage,
  constants,
  sleep
} from 'utils';
import { getCredentials } from './utils';
import { useWindowSize } from 'hooks';
import { GeneralContext } from 'context';
import UsernameText from './index.text.json';

// types
import { ICredential, IProfile } from 'utils/normalizeSchema';

const JoyRideNoSSR = dynamic(() => import('react-joyride'), { ssr: false });

interface IFilterMenuProps {
  currentFilter: string;
  isHidden: boolean;
  onClick: (value: string) => void;
}

interface IHashMailProps {
  subject: string;
  content: string;
  recipients: string[];
}

const { NEXT_PUBLIC_NOTIFY_API_URL } = process.env;
const TEXT_LIMIT = 200;
const SLEEP_TIME = 30000;

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
          currentFilter === 'Activity' ? 'content-filter-menu-item-active' : ''
        }`}
        onClick={() => onClick('Activity')}
      >
        Activities
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'Personhood'
            ? 'content-filter-menu-item-active'
            : ''
        }`}
        onClick={() => onClick('Personhood')}
      >
        Personhood
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'Review' ? 'content-filter-menu-item-active' : ''
        }`}
        onClick={() => onClick('Review')}
      >
        Reviews
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'WorkExperience'
            ? 'content-filter-menu-item-active'
            : ''
        }`}
        onClick={() => onClick('WorkExperience')}
      >
        Works
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'Community' ? 'content-filter-menu-item-active' : ''
        }`}
        onClick={() => onClick('Community')}
      >
        Communities
      </p>
      <p
        className={`content-filter-menu-item ${
          currentFilter === 'Issue' ? 'content-filter-menu-item-active' : ''
        }`}
        onClick={() => onClick('Issue')}
      >
        Issued
      </p>
    </div>
  );
};

export const Username = () => {
  const [status, setStatus] = useState('idle');
  const [profile, setProfile] = useState<IProfile | undefined>();
  const [currentDIDFromURL, setCurrentDIDFromURL] = useState<string>();
  const [currentFilterOption, setCurrentFilterOption] = useState('overview');
  const [currentCustomCredential, setCurrentCustomCredential] =
    useState<ICredential>();
  const [balance, setBalance] = useState<string>('0.0');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareContentOpen, setIsShareContentOpen] = useState(false);
  const [isExportWalletOpen, setIsExportWalletOpen] = useState(false);
  const [arvStars, setArvStars] = useState(0);
  const { query, push, locale } = useRouter();
  const {
    auth,
    storage,
    walletInformation: {
      type,
      ethProvider,
      publicPassport,
      passport,
      issuer,
      orbis,
      deals
    },
    walletModal: { handleOpenConnectWallet },
    profileInformation: { handleSetProfile }
  } = useContext(GeneralContext);
  const windowSize = useWindowSize();
  const isDesktop = windowSize.width >= 1024;
  const isLoading = status === 'idle' || status === 'pending';

  useEffect(() => {
    if (!window) return;
    if (!publicPassport) return;
    if (!query.id) return;
    if (auth.status !== 'resolved') return;

    setStatus('pending');

    const getProfile = async () => {
      try {
        await publicPassport.read((query.id as string).toLowerCase());

        const currentProfile = await normalizeSchema.profile({
          passport: publicPassport,
          orbis
        });

        const currentDIDFromURL = publicPassport.did;
        if (!isValid('did', currentDIDFromURL)) setStatus('rejected');

        let isFollowingUser = false;

        if (auth?.did !== currentDIDFromURL) {
          const response = await orbis.getIsFollowing(auth.did, query.id);
          isFollowingUser = response?.data;
        }

        if (deals) {
          const balance = await deals.paymentsBalance();
          setBalance(balance);
        }

        setProfile({
          ...currentProfile,
          isFollowingUser,
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
  }, [publicPassport, auth.status, auth?.did, query.id, deals]);

  useEffect(() => {
    if (!window) return;
    if (!issuer) return;
    if (!query.id) return;
    if (!query.credential_id) return;
    if (!auth?.isAuthenticated) return;
    if (auth.status !== 'resolved') return;

    const validateCredential = async () => {
      try {
        const currentCredential = await issuer.getCredential(
          query.credential_id
        );

        if (currentCredential) {
          const isCredentialValid = await issuer.checkCredential(
            currentCredential
          );
          const hasCorrectTypes = currentCredential?.type?.some(
            (type: string) =>
              constants.DEFAULT_CLAIM_CREDENTIAL_TYPES.includes(type)
          );

          if (isCredentialValid && hasCorrectTypes) {
            handleCurrentCustomCredential(currentCredential);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    validateCredential();
  }, [
    issuer,
    auth?.isAuthenticated,
    auth.status,
    query.id,
    query.credential_id
  ]);

  /* TODO: Open ai get summary is disabled for now */
  /* useEffect(() => {
    if (!window) return;
    if (auth.status !== 'resolved') return;
    if (status !== 'resolved') return;

    const getSummary = async (skills: string[]) => {
      const summary = await openAI.getSkillSummary(
        Krebit.utils.mergeArray(skills).map((item, index) => {
          if (!item[0].startsWith('token') && !item[0].startsWith('issuer-'))
            return `${item[0]} ${
              parseInt(item[1]) === 1 ? '' : '(' + item[1] + ')'
            }`;
        })
      );

      setProfile(prevValues => ({ ...prevValues, summary }));
    };

    if (profile?.skills && (!profile?.summary || profile?.summary === '')) {
      const skills = Krebit.utils.mergeArray(profile.skills);

      if (skills.length > 10) {
        getSummary(skills);
      }
    }
  }, [status, auth, profile]); */

  useEffect(() => {
    if (!window) return;
    if (auth.status !== 'resolved') return;
    if (status !== 'resolved') return;

    const getArvStars = async () => {
      const reviewCredentials = await getCredentials({
        type: 'Review',
        passport: publicPassport,
        limit: 100
      });

      if (reviewCredentials?.length === 0) return;

      const ratingReviewsList = reviewCredentials
        ?.map(values => values.credential?.value?.values?.rating || 0)
        .map(rating => parseInt(rating, 10) || 0)
        .reduce(
          (acc, value) => ({
            ...acc,
            [value]: (acc[value] || 0) + 1
          }),
          {}
        );
      const ratingReviewsListDoubled = Object.keys(ratingReviewsList).reduce(
        (acc, key) => ({
          ...acc,
          [key]: ratingReviewsList[key] * parseInt(key, 10)
        }),
        {}
      );

      const ratingReviewsListTotal = Object.values(ratingReviewsList).reduce(
        (partialSum: number, a: number) => partialSum + a,
        0
      ) as number;
      const ratingReviewsListDoubledTotal = Object.values(
        ratingReviewsListDoubled
      ).reduce((partialSum: number, a: number) => partialSum + a, 0) as number;

      const avgStars = ratingReviewsListDoubledTotal / ratingReviewsListTotal;

      setArvStars(avgStars);
    };

    getArvStars();
  }, [status, auth]);

  const withdrawPayments = async () => {
    setStatus('pending_withdraw');
    const result = await deals?.withdrawPayments();
    console.log('withdrawPayments: ', result);

    await sleep(SLEEP_TIME);

    if (result) {
      window.location.reload();
    }
  };

  const handleProfile = (profile: IProfile) => {
    setProfile(profile);
  };

  const handleFilterOption = (value: string) => {
    if (value === currentFilterOption) return;

    const isSectionWithNoSkills = value === 'Activity';

    setProfile({
      ...profile,
      skills: isSectionWithNoSkills ? profile.skills : []
    });
    setCurrentFilterOption(value);
  };

  const handleEditProfile = () => {
    if (!auth?.isAuthenticated) return;

    setIsEditProfileOpen(prevState => !prevState);
  };

  const handleCurrentCustomCredential = (credential: any) => {
    setCurrentCustomCredential(credential);
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

  const handleFollowUser = async (isFollowing = false) => {
    if (!auth?.isAuthenticated) {
      handleOpenConnectWallet();
      return;
    }

    if (auth.did === currentDIDFromURL) return;

    try {
      setStatus('follow_pending');

      if (!isValid('did', currentDIDFromURL)) {
        setStatus('rejected');
        return;
      }

      const response = await orbis.setFollow(currentDIDFromURL, isFollowing);

      if (response?.doc) {
        setProfile(prevState => ({
          ...prevState,
          countFollowers: isFollowing
            ? prevState.countFollowers + 1
            : prevState.countFollowers === 0
            ? prevState.countFollowers
            : prevState.countFollowers - 1,
          isFollowingUser: isFollowing
        }));
        setStatus('follow_resolved');
      }
    } catch (error) {
      console.error(error);
      setStatus('follow_rejected');
    }
  };

  const handleSendMessage = async () => {
    if (!auth?.isAuthenticated) {
      handleOpenConnectWallet();
      return;
    }

    if (!isValid('did', currentDIDFromURL)) {
      setStatus('rejected');
      return;
    }

    setStatus('message_pending');

    const currentConversations = await orbis.getConversations({
      did: currentDIDFromURL
    });

    if (currentConversations?.data?.length > 0) {
      const conversationsWithMe = currentConversations?.data?.filter(
        conversation => conversation?.recipients.includes(auth?.did)
      );
      const conversationWithJustMe = conversationsWithMe?.find(
        conversation => conversation?.recipients?.length === 2
      );

      if (conversationWithJustMe) {
        push(`/messages/?conversation_id=${conversationWithJustMe.stream_id}`);
      } else {
        const response = await orbis.createConversation({
          recipients: [currentDIDFromURL]
        });

        if (response?.doc) {
          const { address } = getAddressFromDid(currentDIDFromURL);
          const hashMailNotification = await sendHashMailNotification({
            subject: 'Hey! You have received a new message!',
            content: `${auth?.did} has sent you a new message! Check it out here: https://krebit.id/messages/?conversation_id=${response?.doc}`,
            recipients: [address]
          });

          if (hashMailNotification) {
            window.open(`/messages/?conversation_id=${response.doc}`, '_self');
          }
        }
      }
    } else {
      const response = await orbis.createConversation({
        recipients: [currentDIDFromURL]
      });

      if (response?.doc) {
        const { address } = getAddressFromDid(currentDIDFromURL);
        const hashMailNotification = await sendHashMailNotification({
          subject: 'Hey! You have received a new message!',
          content: `${auth?.did} has sent you a new message! Check it out here: https://krebit.id/messages/?conversation_id=${response?.doc}`,
          recipients: [address]
        });

        if (hashMailNotification) {
          window.open(`/messages/?conversation_id=${response.doc}`, '_self');
        }
      }
    }
  };

  const sendHashMailNotification = async (props: IHashMailProps) => {
    try {
      const { subject, content, recipients } = props;

      const sendHashmailMessage = fetch(NEXT_PUBLIC_NOTIFY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject,
          content,
          recipients
        })
      }).then(result => result.json());

      return sendHashmailMessage;
    } catch (error) {
      console.error(error);
    }
  };

  const handleIsExportWalletOpen = () => {
    setIsExportWalletOpen(prevValue => !prevValue);
  };

  const handleExportWeb3AuthPrivateKey = async () => {
    if (!window) return;
    if (type !== 'web3auth') return;
    if (currentDIDFromURL !== auth?.did) return;

    const privateKey = await ethProvider.request({
      method: 'eth_private_key'
    });

    const fakeLink = document.createElement('a');

    const file = new Blob([privateKey], { type: 'text/plain' });

    fakeLink.href = URL.createObjectURL(file);
    fakeLink.download = 'privateKey.txt';
    fakeLink.click();

    URL.revokeObjectURL(fakeLink.href);
  };

  if (status === 'rejected') {
    return <Error statusCode={404} />;
  }

  return (
    <>
      {profile?.reputation === 0 &&
      auth?.status === 'resolved' &&
      auth?.isAuthenticated &&
      currentDIDFromURL === auth?.did ? (
        <JoyRideNoSSR
          tooltipComponent={props => <HelpTooltip {...props} locale={locale} />}
          continuous
          showProgress
          scrollToFirstStep
          steps={UsernameText[locale].steps}
        />
      ) : null}
      {isEditProfileOpen && (
        <EditProfile
          profile={profile}
          onClose={handleEditProfile}
          handleProfile={handleProfile}
          contextHandleProfile={handleSetProfile}
          orbis={orbis}
          storage={storage}
        />
      )}
      {isExportWalletOpen && (
        <QuestionModal
          title="Export wallet"
          component={() => (
            <QuestionModalText>
              We're going to export your private key, this is escential for your
              personal web3 wallet, with this{' '}
              <a
                href="https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-account"
                target="_blank"
              >
                guide
              </a>{' '}
              you can import it in metamask and start using it!
            </QuestionModalText>
          )}
          continueButton={{
            text: 'Export',
            onClick: handleExportWeb3AuthPrivateKey
          }}
          cancelButton={{
            text: 'Cancel',
            onClick: handleIsExportWalletOpen
          }}
        />
      )}
      <Layout>
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <Wrapper
            id="container"
            profilePicture={formatUrlImage(profile?.picture)}
            isCurrentProfile={currentDIDFromURL !== auth?.did}
            type={type}
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
                          {profile.reputation} Krebits
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
                        {profile.description?.length > TEXT_LIMIT
                          ? profile.description.slice(0, TEXT_LIMIT) + '...'
                          : profile.description}
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
                        <Button
                          text={
                            profile.isFollowingUser ? 'Following' : 'Follow'
                          }
                          isDisabled={status === 'follow_pending'}
                          onClick={() =>
                            handleFollowUser(!profile.isFollowingUser)
                          }
                        />
                      </div>
                      <div className="profile-buttons-container">
                        <Button
                          text="Send Message"
                          onClick={handleSendMessage}
                          styleType="border"
                          isDisabled={status === 'message_pending'}
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
                  <div className="profile-buttons-rounded">
                    <Button
                      icon={<Share />}
                      onClick={handleIsShareContentOpen}
                      styleType="border-rounded"
                    />
                  </div>
                  {currentDIDFromURL === auth?.did && type === 'web3auth' ? (
                    <div className="profile-buttons-rounded">
                      <Button
                        icon={<SystemUpdateAlt />}
                        onClick={handleIsExportWalletOpen}
                        styleType="border-rounded"
                      />
                    </div>
                  ) : null}
                  {isShareContentOpen && (
                    <ShareContentModal
                      customText={`${profile.name}'s Krebited profile on @KrebitID`}
                      onClose={handleIsShareContentOpen}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="content-container">
              <div className="content-left">
                {profile?.summary && (
                  <Summary>
                    <div className="summary-header">
                      <p className="summary-header-text">Summary</p>
                      <div className="summary-header-icon">
                        <SmartToy />
                      </div>
                    </div>
                    <p className="summary-text">{profile.summary}</p>
                  </Summary>
                )}
                {arvStars && (
                  <AvrStars>
                    <div className="arv-stars-header">
                      <p className="arv-stars-header-text">Reviews Rating</p>
                    </div>
                    <div className="arv-stars-content">
                      <Rating
                        name="rating-username-avr-stars"
                        value={parseFloat(arvStars.toString())}
                        readOnly={true}
                        shouldHaveLabel={false}
                      />
                    </div>
                  </AvrStars>
                )}
                {currentDIDFromURL === auth?.did && (
                  <Payments>
                    <div className="payments-header">
                      <p className="payments-header-text">Payments Balance</p>
                      {status === 'pending_withdraw' ? (
                        <div className="payments-loading">
                          <Loading />
                        </div>
                      ) : (
                        <>
                          <p className="payments-header-balance">{`$ ${balance} MATIC`}</p>
                          {parseFloat(balance) !== 0 ? (
                            <div className="payments-buttons">
                              <Button
                                text="Withdraw"
                                onClick={withdrawPayments}
                                isDisabled={false}
                              />
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </Payments>
                )}
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
                      {Krebit.utils
                        .mergeArray(profile.skills)
                        .map((item, index) => {
                          if (
                            !item[0].startsWith('token') &&
                            !item[0].startsWith('issuer-')
                          )
                            return (
                              <div className="skills-box-item" key={index}>
                                <p className="skills-box-item-text">
                                  {item[0]}{' '}
                                  {parseInt(item[1]) === 1
                                    ? ''
                                    : '(' + item[1] + ')'}
                                </p>
                              </div>
                            );
                        })}
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
                <Activity
                  did={currentDIDFromURL}
                  currentFilterOption={currentFilterOption}
                  onFilterOption={handleFilterOption}
                  isHidden={
                    currentFilterOption !== 'overview' &&
                    currentFilterOption !== 'Activity'
                  }
                  ensDomain={profile?.ensDomain}
                  unsDomain={profile?.unsDomain}
                />
                <Review
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  passport={passport}
                  publicPassport={publicPassport}
                  issuer={issuer}
                  orbis={orbis}
                  currentFilterOption={currentFilterOption}
                  onFilterOption={handleFilterOption}
                  isHidden={
                    currentFilterOption !== 'overview' &&
                    currentFilterOption !== 'Review'
                  }
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
                  customCredential={currentCustomCredential}
                  onCustomCredential={handleCurrentCustomCredential}
                />
                <Issue
                  isAuthenticated={currentDIDFromURL === auth?.did}
                  passport={passport}
                  publicPassport={publicPassport}
                  currentFilterOption={currentFilterOption}
                  onFilterOption={handleFilterOption}
                  isHidden={
                    currentFilterOption !== 'overview' &&
                    currentFilterOption !== 'Issue'
                  }
                />
              </div>
            </div>
          </Wrapper>
        )}
      </Layout>
    </>
  );
};
