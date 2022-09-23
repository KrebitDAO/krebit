import { Dispatch, SetStateAction, useState } from 'react';
import {
  Passport,
  Krebit as Issuer
} from '@krebitdao/reputation-passport/dist/core';

import { Wrapper } from './styles';
import { VerifyCredential } from './verifyCredential';
import { QuestionModal } from 'components/QuestionModal';
import { Card } from 'components/Card';
import { checkCredentialsURLs } from 'utils';

// types
import { IProfile, ICredential } from 'utils/normalizeSchema';

interface IProps {
  isAuthenticated: boolean;
  communities: ICredential[];
  passport: Passport;
  issuer: Issuer;
  handleProfile: Dispatch<SetStateAction<IProfile>>;
}

export const Community = (props: IProps) => {
  const {
    communities,
    isAuthenticated,
    passport,
    issuer,
    handleProfile
  } = props;
  const [currentCommunitySelected, setCurrentCommunitySelected] = useState<
    ICredential
  >();
  const [currentActionType, setCurrentActionType] = useState<string>();
  const [status, setStatus] = useState('idle');
  const [isDropdownOpen, setIsDropdownOpen] = useState(undefined);
  const [isVerifyCredentialOpen, setIsVerifyCredentialOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

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
      stamps: []
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
    if (!isAuthenticated) return;

    setCurrentCommunitySelected(values);
    setCurrentActionType(type);

    if (type === 'add_stamp') {
      setIsVerifyCredentialOpen(true);
    }

    if (type === 'remove_credential' || type === 'remove_stamp') {
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
        setStatus('remove_pending');

        const response = await passport.removeCredential(
          currentCommunitySelected.credential?.vcId
        );

        if (response) {
          handleIsRemoveModalOpen();
        }
      }

      if (currentActionType === 'remove_stamp') {
        setStatus('remove_pending');

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
      setStatus('rejected');
    }
  };

  const handleClaimValue = async (type: string, credential: any) => {
    const claimValue =
      type === 'decrypt'
        ? await issuer.decryptClaimValue(credential)
        : { encrypted: '********' };

    const currentCredentialPosition = communities.findIndex(
      personhood => personhood.credential.vcId === credential.vcId
    );

    if (currentCredentialPosition === -1) return;

    if (claimValue) {
      delete claimValue?.proofs;

      handleProfile(prevValues => {
        const updatedPersnohoods = [...prevValues.personhoods];
        updatedPersnohoods[currentCredentialPosition] = {
          ...updatedPersnohoods[currentCredentialPosition],
          credential: {
            ...updatedPersnohoods[currentCredentialPosition].credential,
            value: claimValue
          }
        };

        return {
          ...prevValues,
          personhoods: updatedPersnohoods
        };
      });
    }
  };

  const formatCredentialName = (value: any) => {
    if (value?.encrypted) return value.encrypted;

    if (value?.id) {
      return value.id;
    }

    return '';
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
          isLoading={status === 'remove_pending'}
        />
      ) : null}
      <Wrapper>
        <div className="community-header">
          <p className="community-header-text">Community credentials</p>
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
          {communities.map((community, index) => (
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
                            'stamp',
                            community.stamps[0]
                          )
                      }
                    : undefined,
                  isAuthenticated && community.stamps?.length === 0
                    ? {
                        title: 'Add stamp',
                        onClick: () =>
                          handleCurrentCommunity('add_stamp', community)
                      }
                    : undefined,
                  isAuthenticated &&
                  community.credential?.visualInformation.isEncryptedByDefault
                    ? community.credential?.value?.encrypted
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
                          handleCurrentCommunity('remove_credential', community)
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
              image={community.credential?.visualInformation?.imageUrl}
              tooltip={{
                message: `This credential has ${community.stamps?.length ||
                  0} stamps`
              }}
            />
          ))}
        </div>
      </Wrapper>
    </>
  );
};
