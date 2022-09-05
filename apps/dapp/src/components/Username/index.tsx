import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Error from 'next/error';

import {
  Background,
  EducationCredentials,
  LoadingWrapper,
  PersonhoodCredential,
  Skills,
  WorkCredential,
  Wrapper
} from './styles';
import { VerifyPersonhoodCredential } from './VerifyPersonhoodCredential';
import { Krebit } from 'components/Icons';
import { Button } from 'components/Button';
import { Layout } from 'components/Layout';
import { ToolTip } from 'components/ToolTip';
import { constants, sortByDate, isValid, normalizeSchema } from 'utils';
import { GeneralContext } from 'context';
import { Loading } from 'components/Loading';

// types
import { IProfile } from 'utils/normalizeSchema';

const MOCK_SKILLS = [
  'PHP expert',
  'Pascal evangelist',
  'Assembly builder',
  'C master',
  'C++ pro'
];

export const Username = () => {
  const [
    currentPersonhoodToolTipActive,
    setCurrentPersonhoodToolTipActive
  ] = useState<number | undefined>(undefined);
  const [
    isVerifyPersonhoodCredentialOpen,
    setIsVerifyPersonhoodCredentialOpen
  ] = useState(false);
  const [status, setStatus] = useState('idle');
  const [profile, setProfile] = useState<IProfile | undefined>();
  const { query } = useRouter();
  const {
    auth,
    walletInformation: { publicPassport, orbis }
  } = useContext(GeneralContext);
  const isLoading = status === 'idle' || status === 'pending';

  useEffect(() => {
    if (!window) return;
    if (!publicPassport) return;
    if (!query.id) return;

    setStatus('pending');

    const isValidID = isValid('did', query.id as string);

    if (!isValidID) {
      setStatus('rejected');
      return;
    }

    const getProfile = async () => {
      try {
        const did = query.id;
        const address = (query.id as string).match(/0x[a-fA-F0-9]{40}/g)[0];

        publicPassport.read(address, did);

        let currentProfile: IProfile;

        const profile = await publicPassport.getProfile();
        const orbisProfile = await orbis.getProfile(did);
        const reputation = await publicPassport.getReputation();

        currentProfile = normalizeSchema.profile(
          profile,
          orbisProfile,
          reputation,
          did as string
        );

        const discordCredentials = await publicPassport.getCredentials(
          'discord'
        );
        const twitterCredentials = await publicPassport.getCredentials(
          'twitter'
        );
        const veriffCredentials = await publicPassport.getCredentials(
          'legalName'
        );
        const latestDiscordCredential = discordCredentials
          .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
          .at(-1);
        const latestTwitterCredential = twitterCredentials
          .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
          .at(-1);
        const latestVeriffCredential = veriffCredentials
          .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate))
          .at(-1);

        const stamps = await publicPassport.getStamps({
          type: 'digitalProperty'
        });
        const latestDiscordStamp = stamps.find(
          stamp => stamp.claimId === latestDiscordCredential?.id
        );
        const latestTwitterStamp = stamps.find(
          stamp => stamp.claimId === latestTwitterCredential?.id
        );
        const latestVeriffStamp = stamps.find(
          stamp => stamp.claimId === latestVeriffCredential?.id
        );

        currentProfile = {
          ...currentProfile,
          personhood: {
            discord: {
              length: discordCredentials?.length || 0,
              credential: latestDiscordCredential,
              stamp: latestDiscordStamp
            },
            twitter: {
              length: twitterCredentials?.length || 0,
              credential: latestTwitterCredential,
              stamp: latestTwitterStamp
            },
            veriff: {
              length: veriffCredentials?.length || 0,
              credential: latestVeriffCredential,
              stamp: latestVeriffStamp
            }
          }
        };

        setProfile(currentProfile);
        setStatus('resolved');
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getProfile();
  }, [publicPassport, query.id]);

  const handleCurrentPersonhoodToolTipActive = (index: number) => {
    setCurrentPersonhoodToolTipActive(index);
  };
  const handleCurrentPersonhoodToolTipActiveCallback = useCallback(
    handleCurrentPersonhoodToolTipActive,
    [currentPersonhoodToolTipActive]
  );

  const handleCurrentPersonhoodToolTipHide = () => {
    setCurrentPersonhoodToolTipActive(undefined);
  };
  const handleCurrentPersonhoodToolTipHideActiveCallback = useCallback(
    handleCurrentPersonhoodToolTipHide,
    [currentPersonhoodToolTipActive]
  );

  const handleIsVerifyPersonhoodCredentialOpen = () => {
    setIsVerifyPersonhoodCredentialOpen(prevState => !prevState);
  };

  if (status === 'rejected') {
    return <Error statusCode={404} />;
  }

  return (
    <Layout>
      {isVerifyPersonhoodCredentialOpen && (
        <VerifyPersonhoodCredential
          currentPersonhood={profile?.personhood}
          onClose={handleIsVerifyPersonhoodCredentialOpen}
        />
      )}
      {isLoading ? (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      ) : (
        <Wrapper>
          <div className="profile-container">
            <Background image={profile.background} />
            <div className="profile">
              <div className="profile-photo">
                <Image
                  src={profile.picture || '/imgs/logos/Krebit.svg'}
                  layout="fill"
                />
              </div>
              <div className="profile-info">
                <div className="profile-info-naming">
                  <p className="profile-info-name">{profile.name}</p>{' '}
                  <span className="profile-info-token">
                    rkRB {profile.reputation}
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
              {query.id !== auth?.did && (
                <div className="profile-buttons">
                  <Button text="Follow" onClick={() => {}} />
                  <Button
                    text="Send Message"
                    onClick={() => {}}
                    styleType="border"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="content-container">
            <div className="content-left">
              <PersonhoodCredential>
                <div className="person-header">
                  <p className="person-header-text">Personhood Credentials</p>
                  {query.id === auth?.did && (
                    <p
                      className="person-header-verify"
                      onClick={handleIsVerifyPersonhoodCredentialOpen}
                    >
                      Verify
                    </p>
                  )}
                </div>
                <div className="person-box">
                  {constants.PERSONHOOD_CREDENTIALS.map((item, index) => (
                    <Fragment key={index}>
                      <div className="person-box-item">
                        <div className="person-box-icon">{item.icon}</div>
                        <p className="person-box-item-text">{item.text}</p>
                        <div
                          className="person-box-item-tooltip"
                          onMouseOver={() =>
                            handleCurrentPersonhoodToolTipActiveCallback(
                              index + 1
                            )
                          }
                          onMouseOut={
                            handleCurrentPersonhoodToolTipHideActiveCallback
                          }
                        >
                          <div
                            className={`person-box-icon person-box-item-icon ${
                              profile.personhood[item.id]?.credential &&
                              profile.personhood[item.id]?.stamp
                                ? 'person-box-item-icon-is-active'
                                : ''
                            }`}
                          >
                            <Krebit />
                          </div>
                          {currentPersonhoodToolTipActive === index + 1 && (
                            <div className="person-box-item-tooltip-box">
                              <ToolTip
                                message={`This personhood credential has ${profile
                                  .personhood[item.id]?.length ||
                                  0} credentials`}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      {index !==
                        constants.PERSONHOOD_CREDENTIALS.length - 1 && (
                        <hr className="person-box-item-hr" />
                      )}
                    </Fragment>
                  ))}
                </div>
              </PersonhoodCredential>
              <Skills>
                <div className="skills-header">
                  <p className="skills-header-text">Skills</p>
                </div>
                <div className="skills-box">
                  {MOCK_SKILLS.map((item, index) => (
                    <div className="skills-box-item" key={index}>
                      <p className="skills-box-item-text">{item}</p>
                    </div>
                  ))}
                </div>
              </Skills>
            </div>
            <div className="content-right">
              <EducationCredentials>
                <div className="education-header">
                  <p className="education-header-text">Education credentials</p>
                  {query.id === auth?.did && (
                    <p className="education-header-verify" onClick={() => {}}>
                      Verify
                    </p>
                  )}
                </div>
                <div className="education-cards">
                  {new Array(2).fill(0).map((_, index) => (
                    <div className="education-card" key={index}>
                      <div className="education-card-information">
                        <p className="education-card-information-title">
                          English school
                        </p>
                        <p className="education-card-information-company">
                          Platzi
                        </p>
                      </div>
                      <div className="education-card-top-icon">
                        <Krebit />
                      </div>
                      <div className="education-card-dates">
                        <div className="education-card-date">
                          <p className="education-card-date-title">ISSUED</p>
                          <p className="education-card-date-text">02/11/2022</p>
                        </div>
                        <div className="education-card-date">
                          <p className="education-card-date-title">EXPIRES</p>
                          <p className="education-card-date-text">05/12/2024</p>
                        </div>
                      </div>
                      <div className="education-card-bottom-icon">
                        <Image src="/imgs/images/platzi.png" layout="fill" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="education-view-more">View 7 more</p>
              </EducationCredentials>
              <WorkCredential>
                <div className="work-header">
                  <p className="work-header-text">Work credentials</p>
                  {query.id === auth?.did && (
                    <p className="work-header-verify" onClick={() => {}}>
                      Verify
                    </p>
                  )}
                </div>
                <div className="work-cards">
                  {new Array(2).fill(0).map((_, index) => (
                    <div className="work-card" key={index}>
                      <div className="work-card-image">
                        <Image
                          src="/imgs/logos/ethereum-logo.png"
                          width={75}
                          height={31}
                        />
                      </div>
                      <div className="work-card-information">
                        <p className="work-card-information-title">
                          Frontend Developer
                        </p>
                        <p className="work-card-information-description">
                          Google / May 2021 - Feb 2022
                        </p>
                        <p className="work-card-information-date">
                          ISSUED <span>02/11/2022</span>
                        </p>
                      </div>
                      <div className="work-card-icon">
                        <Krebit />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="work-view-more">View 7 more</p>
              </WorkCredential>
            </div>
          </div>
        </Wrapper>
      )}
    </Layout>
  );
};
