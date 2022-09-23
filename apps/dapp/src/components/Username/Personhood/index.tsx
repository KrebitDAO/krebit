import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Passport,
  Krebit as Issuer
} from '@krebitdao/reputation-passport/dist/core';

import { Wrapper } from './styles';
import { VerifyCredential } from './verifyCredential';
import { OpenInNew } from 'components/Icons';
import { QuestionModal } from 'components/QuestionModal';
import { Card } from 'components/Card';
import { getCredentials } from '../utils';
import { checkCredentialsURLs } from 'utils';

// types
import { ICredential, IProfile } from 'utils/normalizeSchema';

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

export const Personhood = (props: IProps) => {
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
  const [personhoods, setPersonhoods] = useState<ICredential[]>();
  const [actionStatus, setActionStatus] = useState('idle');
  const [currentPersonhoodSelected, setCurrentPersonhoodSelected] =
    useState<ICredential>();
  const [currentActionType, setCurrentActionType] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(undefined);
  const [isVerifyCredentialOpen, setIsVerifyCredentialOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const isLoading = status === 'idle' || status === 'pending';

  useEffect(() => {
    if (!window) return;
    if (!publicPassport) return;
    if (isHidden) return;

    setStatus('pending');

    const getInformation = async () => {
      try {
        const personhoodCredentials = await getCredentials({
          type: 'personhood',
          passport: publicPassport,
          limit: currentFilterOption === 'overview' ? 3 : 100
        });

        setPersonhoods(personhoodCredentials);
        handleProfile(prevValues => ({
          ...prevValues,
          skills: prevValues.skills.concat(
            personhoodCredentials.flatMap(credential => credential.skills)
          )
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
    setCurrentPersonhoodSelected({
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

  const handleCurrentPersonhood = (type: string, values: ICredential) => {
    if (!isAuthenticated) return;

    setCurrentPersonhoodSelected(values);
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
    if (!currentPersonhoodSelected) return;

    try {
      if (currentActionType === 'remove_credential') {
        setActionStatus('remove_pending');

        const response = await passport.removeCredential(
          currentPersonhoodSelected.credential?.vcId
        );

        if (response) {
          handleIsRemoveModalOpen();
        }
      }

      if (currentActionType === 'remove_stamp') {
        setActionStatus('remove_pending');

        const response = await issuer.removeStamp(
          currentPersonhoodSelected.stamps[0],
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
    const claimValue =
      type === 'decrypt'
        ? await issuer.decryptClaimValue(credential)
        : { encrypted: '********' };

    const currentCredentialPosition = personhoods.findIndex(
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

    if (value?.protocol === 'email') {
      return value.username.concat('@').concat(value.host);
    }

    if (value?.username) {
      return '@'.concat(value.username);
    }

    if (value?.fullName) {
      return value.fullName;
    }

    if (value?.id) {
      return value.id;
    }

    if (value?.countryCode) {
      return `+${value?.countryCode}${value?.number}`;
    }

    if (value?.followers) {
      return value.followers.startsWith('gt')
        ? value.followers.replace('gt', '> ')
        : value.followers;
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
          currentPersonhood={currentPersonhoodSelected}
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
      <Wrapper isHidden={isHidden} currentFilterOption={currentFilterOption}>
        <div className="person-header">
          <div className="person-header-text-container">
            <p className="person-header-text">Personhood Credentials</p>
            {currentFilterOption === 'overview' && (
              <div
                className="person-header-text-open-new"
                onClick={() => onFilterOption('personhood')}
              >
                <OpenInNew />
              </div>
            )}
          </div>
          {isAuthenticated && (
            <p
              className="person-header-verify"
              onClick={handleIsVerifyCredentialOpen}
            >
              Verify
            </p>
          )}
        </div>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <div className="cards-box">
            {personhoods.map((personhood, index) => (
              <Card
                key={index}
                type="simple"
                id={`personhood_${index}`}
                icon={personhood.credential?.visualInformation?.icon}
                title={personhood.credential?.visualInformation?.entity}
                description={formatCredentialName(personhood.credential?.value)}
                dates={{
                  issuanceDate: {
                    text: 'ISSUED',
                    value: personhood.credential?.issuanceDate
                  },
                  expirationDate: {
                    text: 'EXPIRES',
                    value: personhood.credential?.expirationDate
                  }
                }}
                dropdown={{
                  isDropdownOpen,
                  onClick: () => handleIsDropdownOpen(`personhood_${index}`),
                  onClose: () => handleIsDropdownOpen(undefined),
                  items: [
                    !isAuthenticated
                      ? {
                          title: 'Credential details',
                          onClick: () =>
                            handleCheckCredentialsURLs(
                              'ceramic',
                              'credential',
                              personhood.credential
                            )
                        }
                      : undefined,
                    !isAuthenticated && personhood.stamps?.length !== 0
                      ? {
                          title: 'Stamp details',
                          onClick: () =>
                            handleCheckCredentialsURLs(
                              'polygon',
                              'stamp',
                              personhood.stamps[0]
                            )
                        }
                      : undefined,
                    isAuthenticated && personhood.stamps?.length === 0
                      ? {
                          title: 'Add stamp',
                          onClick: () =>
                            handleCurrentPersonhood('add_stamp', personhood)
                        }
                      : undefined,
                    isAuthenticated &&
                    personhood.credential?.visualInformation
                      .isEncryptedByDefault
                      ? personhood.credential?.value?.encrypted
                        ? {
                            title: 'Decrypt',
                            onClick: () =>
                              handleCurrentPersonhood('decrypt', personhood)
                          }
                        : {
                            title: 'Encrypt',
                            onClick: () =>
                              handleCurrentPersonhood('encrypt', personhood)
                          }
                      : undefined,
                    isAuthenticated && personhood.stamps?.length === 0
                      ? {
                          title: 'Remove credential',
                          onClick: () =>
                            handleCurrentPersonhood(
                              'remove_credential',
                              personhood
                            )
                        }
                      : undefined,
                    isAuthenticated &&
                    personhood.credential &&
                    personhood.stamps?.length !== 0
                      ? {
                          title: 'Remove stamp',
                          onClick: () =>
                            handleCurrentPersonhood('remove_stamp', personhood)
                        }
                      : undefined
                  ]
                }}
                isIssued={
                  personhood.credential && personhood.stamps?.length > 0
                }
                tooltip={{
                  message: `This credential has ${
                    personhood.stamps?.length || 0
                  } stamps`
                }}
              />
            ))}
          </div>
        )}
      </Wrapper>
    </>
  );
};
