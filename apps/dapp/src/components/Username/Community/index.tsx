import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { Wrapper } from './styles';
import { VerifyCredential } from './verifyCredential';
import { OpenInNew } from 'components/Icons';
import { QuestionModal } from 'components/QuestionModal';
import { Card } from 'components/Card';
import { Loading } from 'components/Loading';
import { getCredentials } from '../utils';
import { checkCredentialsURLs, constants } from 'utils';

const DynamicShareWithModal = dynamic(
  () => import('../../ShareWithModal').then(c => c.ShareWithModal),
  {
    ssr: false
  }
);

// types
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';
import { Krebit as Issuer } from '@krebitdao/reputation-passport/dist/core/Krebit';
import { IProfile, ICredential } from 'utils/normalizeSchema';

interface IProps {
  isAuthenticated: boolean;
  passport: Passport;
  publicPassport: Passport;
  issuer: Issuer;
  currentFilterOption: string;
  onFilterOption: (value: string) => void;
  isHidden: boolean;
  handleProfile: Dispatch<SetStateAction<IProfile>>;
}

export const Community = (props: IProps) => {
  const {
    isAuthenticated,
    passport,
    publicPassport,
    issuer,
    currentFilterOption,
    onFilterOption,
    isHidden,
    handleProfile
  } = props;
  const [status, setStatus] = useState('idle');
  const [communities, setCommunities] = useState<ICredential[]>([]);
  const [actionStatus, setActionStatus] = useState('idle');
  const [currentCommunitySelected, setCurrentCommunitySelected] =
    useState<ICredential>();
  const [currentActionType, setCurrentActionType] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(undefined);
  const [isVerifyCredentialOpen, setIsVerifyCredentialOpen] = useState(false);
  const [isShareWithModalOpen, setIsShareWithModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const isLoading = status === 'idle' || status === 'pending';

  useEffect(() => {
    if (!window) return;
    if (!publicPassport) return;
    if (isHidden) return;

    setStatus('pending');
    // This is a temporary solution to determine if this component is loading or not, passing skills as undefined
    handleProfile(prevValues => ({
      ...prevValues,
      skills: undefined
    }));

    const getInformation = async () => {
      try {
        const communityCredentials = await getCredentials({
          type: 'Community',
          passport: publicPassport,
          limit: currentFilterOption === 'overview' ? 4 : 100
        });

        setCommunities(communityCredentials);
        handleProfile(prevValues => ({
          ...prevValues,
          skills:
            (prevValues.skills || [])?.concat(
              communityCredentials.flatMap(credential => credential.skills)
            ) || []
        }));
        setStatus('resolved');
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getInformation();
  }, [publicPassport, currentFilterOption, isHidden]);

  const handleIsDropdownOpen = (id: string) => {
    if (isDropdownOpen === undefined || isDropdownOpen !== id) {
      setIsDropdownOpen(id);
    }

    if (isDropdownOpen !== undefined && isDropdownOpen === id) {
      setIsDropdownOpen(undefined);
    }
  };

  const handleIsVerifyCredentialOpen = () => {
    if (!isAuthenticated) return;

    setIsVerifyCredentialOpen(prevState => !prevState);
    setCurrentCommunitySelected({
      credential: undefined,
      stamps: [],
      isMinted: false
    });
  };

  const handleIsShareWithModalOpen = () => {
    if (!isAuthenticated) return;

    setIsShareWithModalOpen(prevState => !prevState);
    setCurrentCommunitySelected({
      credential: undefined,
      stamps: [],
      isMinted: false
    });
  };

  const handleIsRemoveModalOpen = () => {
    if (!isAuthenticated) return;

    // TODO: WE SHOULD USE THIS METHOD INSTEAD
    // setIsRemoveModalOpen(prevState => !prevState);

    if (!window) return;
    window.location.reload();
  };

  const handleCurrentCommunity = (type: string, values: ICredential) => {
    setCurrentCommunitySelected(values);
    setCurrentActionType(type);

    if (type === 'share_with') {
      if (!isAuthenticated) return;
      setIsShareWithModalOpen(true);
    }

    if (type === 'add_stamp') {
      if (!isAuthenticated) return;
      setIsVerifyCredentialOpen(true);
    }

    if (type === 'remove_credential' || type === 'remove_stamp') {
      if (!isAuthenticated) return;
      setIsRemoveModalOpen(true);
    }

    if (type === 'decrypt' || type === 'encrypt') {
      handleClaimValue(type, values.credential);
    }

    handleIsDropdownOpen(undefined);
  };

  const handleRemoveAction = async () => {
    if (!currentCommunitySelected) return;

    try {
      if (currentActionType === 'remove_credential') {
        setActionStatus('remove_pending');

        const response = await passport.removeCredential(
          currentCommunitySelected.credential?.vcId
        );

        if (response) {
          handleIsRemoveModalOpen();
        }
      }

      if (currentActionType === 'remove_stamp') {
        setActionStatus('remove_pending');

        const response = await issuer.removeStamp(
          currentCommunitySelected.stamps[0],
          'Stamp removed from Krebit.id'
        );

        if (response) {
          handleIsRemoveModalOpen();
        }
      }
    } catch (error) {
      console.error(error);
      setActionStatus('rejected');
    }
  };

  const handleClaimValue = async (type: string, credential: any) => {
    let claimValue = credential.value;

    if (type === 'decrypt') {
      claimValue = await issuer.decryptClaimValue(credential.value);
    }

    if (type === 'encrypt') {
      claimValue = await passport.getClaimValue(credential);
    }

    const currentCredentialPosition = communities.findIndex(
      community => community.credential.vcId === credential.vcId
    );

    if (currentCredentialPosition === -1) return;

    if (claimValue) {
      const updatedCommunities = [...communities];
      updatedCommunities[currentCredentialPosition] = {
        ...updatedCommunities[currentCredentialPosition],
        credential: {
          ...updatedCommunities[currentCredentialPosition].credential,
          value: claimValue
        }
      };

      setCommunities(updatedCommunities);
    }
  };

  const formatCredentialName = (value: any) => {
    if (value?.encryptedString) return '******';

    let formattedValue = '';
    if (value?.entity)
      formattedValue = formattedValue?.concat(' / ')?.concat(value.entity);
    if (value?.description)
      formattedValue = formattedValue?.concat(' / ')?.concat(value.description);
    if (value?.role)
      formattedValue = formattedValue?.concat(' / ')?.concat(value.role);

    if (value?.username) {
      formattedValue = formattedValue
        ?.concat(' / ')
        ?.concat('@')
        ?.concat(value.username);
    }

    if (value?.id) {
      formattedValue = formattedValue?.concat(' / ')?.concat(value.id);
    }

    return formattedValue;
  };

  const handleCheckCredentialsURLs = (
    type: string,
    valuesType: string,
    values: any
  ) => {
    checkCredentialsURLs(type, valuesType, values);
    handleIsDropdownOpen(undefined);
  };

  return (
    <>
      {isVerifyCredentialOpen ? (
        <VerifyCredential
          currentCommunity={currentCommunitySelected}
          onClose={handleIsVerifyCredentialOpen}
        />
      ) : null}
      {isRemoveModalOpen ? (
        <QuestionModal
          text="This action can't be undone."
          continueButton={{
            text: 'Delete',
            onClick: handleRemoveAction
          }}
          cancelButton={{ text: 'Cancel', onClick: handleIsRemoveModalOpen }}
          isLoading={actionStatus === 'remove_pending'}
        />
      ) : null}
      <Wrapper isHidden={isHidden}>
        <div className="community-header">
          <div className="community-header-text-container">
            <p className="community-header-text">Community credentials</p>
            {currentFilterOption === 'overview' && (
              <div
                className="community-header-text-open-new"
                onClick={() => onFilterOption('Community')}
              >
                <OpenInNew />
              </div>
            )}
          </div>
          {isAuthenticated && (
            <p
              className="community-header-verify"
              onClick={handleIsVerifyCredentialOpen}
            >
              Verify
            </p>
          )}
        </div>
        <div className="community-cards">
          {isLoading ? (
            <>
              <div className="community-card-loading">
                <Loading type="skeleton" />
              </div>
              <div className="community-card-loading">
                <Loading type="skeleton" />
              </div>
            </>
          ) : communities?.length === 0 ? (
            new Array(2)
              .fill(constants.DEFAULT_EMPTY_CARD_COMMUNITY)
              .map((community, index) => (
                <Card
                  key={index}
                  type="small"
                  id={`community_${index}`}
                  isEmpty={true}
                  {...community}
                />
              ))
          ) : (
            communities.map((community, index) => (
              <Card
                key={index}
                type="small"
                id={`community_${index}`}
                icon={community.credential?.visualInformation?.icon}
                title={community.credential?.visualInformation?.entity}
                description={formatCredentialName(community.credential?.value)}
                dates={{
                  issuanceDate: {
                    text: 'ISSUED',
                    value: community.credential?.issuanceDate
                  },
                  expirationDate: {
                    text: 'EXPIRES',
                    value: community.credential?.expirationDate
                  }
                }}
                dropdown={{
                  isDropdownOpen,
                  onClick: () => handleIsDropdownOpen(`community_${index}`),
                  onClose: () => handleIsDropdownOpen(undefined),
                  items: [
                    !isAuthenticated
                      ? {
                          title: 'Credential details',
                          onClick: () =>
                            handleCheckCredentialsURLs(
                              'ceramic',
                              'credential',
                              community.credential
                            )
                        }
                      : undefined,
                    !isAuthenticated && community.stamps?.length !== 0
                      ? {
                          title: 'Stamp details',
                          onClick: () =>
                            handleCheckCredentialsURLs(
                              'polygon',
                              'tx',
                              community.stamps[0]
                            )
                        }
                      : undefined,
                    isAuthenticated &&
                    process.env.NEXT_PUBLIC_NETWORK === 'mumbai' &&
                    community.credential?.visualInformation.isEncryptedByDefault
                      ? {
                          title: 'Share with',
                          onClick: () =>
                            handleCurrentCommunity('share_with', community)
                        }
                      : undefined,
                    isAuthenticated && community.stamps?.length === 0
                      ? {
                          title: 'Add stamp',
                          onClick: () =>
                            handleCurrentCommunity('add_stamp', community)
                        }
                      : undefined,
                    community.credential?.visualInformation.isEncryptedByDefault
                      ? community.credential?.value?.encryptedString
                        ? {
                            title: 'Decrypt',
                            onClick: () =>
                              handleCurrentCommunity('decrypt', community)
                          }
                        : {
                            title: 'Encrypt',
                            onClick: () =>
                              handleCurrentCommunity('encrypt', community)
                          }
                      : undefined,
                    isAuthenticated && community.stamps?.length === 0
                      ? {
                          title: 'Remove credential',
                          onClick: () =>
                            handleCurrentCommunity(
                              'remove_credential',
                              community
                            )
                        }
                      : undefined,
                    isAuthenticated &&
                    community.credential &&
                    community.stamps?.length !== 0
                      ? {
                          title: 'Remove stamp',
                          onClick: () =>
                            handleCurrentCommunity('remove_stamp', community)
                        }
                      : undefined
                  ]
                }}
                isIssued={community.credential && community.stamps?.length > 0}
                image={
                  community.credential?.value?.imageUrl
                    ? community.credential?.value?.imageUrl
                    : community.credential?.visualInformation?.imageUrl
                }
                tooltip={{
                  message: `This credential has ${
                    community.stamps?.length || 0
                  } stamps`
                }}
              />
            ))
          )}
        </div>
      </Wrapper>
    </>
  );
};
