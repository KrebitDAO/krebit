import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';

import { Background, LoadingWrapper, Skills, Wrapper } from './styles';
import { Personhood } from './Personhood';
import { Education } from './Education';
import { Button } from 'components/Button';
import { Layout } from 'components/Layout';
import { Loading } from 'components/Loading';
import { ConnectWallet } from 'components/ConnectWallet';
import { constants, sortByDate, isValid, normalizeSchema } from 'utils';
import { GeneralContext } from 'context';

// types
import { IProfile } from 'utils/normalizeSchema';
import { Work } from './Work';

const MOCK_SKILLS = ['Not a Robot', 'Anti-Sybil', 'Person', 'Human'];

export const Username = () => {
  const [status, setStatus] = useState('idle');
  const [profile, setProfile] = useState<IProfile | undefined>();
  const { query, push } = useRouter();
  const {
    auth,
    walletInformation: { publicPassport, passport, issuer, orbis },
    walletModal: { openConnectWallet, handleOpenConnectWallet }
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

        let currentProfile = await normalizeSchema.profile(
          publicPassport,
          orbis
        );

        const currentCredentials = await publicPassport.getCredentials();

        if (currentCredentials?.length === 0) {
          currentProfile = {
            ...currentProfile,
            personhoods: []
          };
        }

        const currentPersonhoods = await Promise.all(
          currentCredentials.map(async credential => {
            const stamps = await publicPassport.getStamps({
              type: 'digitalProperty',
              claimId: credential.id
            });
            const visualInformation = constants.PERSONHOOD_CREDENTIALS.find(
              constant => credential.type.includes(constant.id)
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

        currentProfile = {
          ...currentProfile,
          personhoods: currentPersonhoods
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

  const handleProfile = (profile: IProfile) => {
    setProfile(profile);
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
          <Wrapper profilePicture={profile.picture || '/imgs/logos/Krebit.svg'}>
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
                {query.id !== auth?.did && (
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
                    {MOCK_SKILLS.map((item, index) => (
                      <div className="skills-box-item" key={index}>
                        <p className="skills-box-item-text">{item}</p>
                      </div>
                    ))}
                  </div>
                </Skills>
                <Personhood
                  isAuthenticated={query.id === auth?.did}
                  personhoods={profile.personhoods}
                  passport={passport}
                  issuer={issuer}
                  handleProfile={handleProfile}
                />
              </div>
              <div className="content-right">
                <Education
                  isAuthenticated={query.id === auth?.did}
                  educations={[]}
                  passport={passport}
                  issuer={issuer}
                  handleProfile={handleProfile}
                />
                <Work
                  isAuthenticated={query.id === auth?.did}
                  works={[]}
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
