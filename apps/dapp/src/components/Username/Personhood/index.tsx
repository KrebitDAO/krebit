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
import { ICredential, IProfile } from 'utils/normalizeSchema';
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';
import { Krebit as Issuer } from '@krebitdao/reputation-passport/dist/core/Krebit';

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
  const [personhoods, setPersonhoods] = useState<ICredential[]>([]);
  const [actionStatus, setActionStatus] = useState('idle');
  const [currentPersonhoodSelected, setCurrentPersonhoodSelected] =
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
        const personhoodCredentials = await getCredentials({
          type: 'Personhood',
          passport: publicPassport,
          limit: currentFilterOption === 'overview' ? 3 : 100
        });

        setPersonhoods(personhoodCredentials);
        handleProfile(prevValues => ({
          ...prevValues,
          skills:
            (prevValues.skills || []).concat(
              personhoodCredentials.flatMap(credential => credential.skills)
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
    setCurrentPersonhoodSelected({
      credential: undefined,
      stamps: [],
      isMinted: false
    });
  };

  const handleIsShareWithModalOpen = () => {
    if (!isAuthenticated) return;

    setIsShareWithModalOpen(prevState => !prevState);
    setCurrentPersonhoodSelected({
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

  const handleCurrentPersonhood = (type: string, values: ICredential) => {
    if (!isAuthenticated) return;

    setCurrentPersonhoodSelected(values);
    setCurrentActionType(type);

    if (type === 'share_with') {
      setIsShareWithModalOpen(true);
    }

    if (type === 'add_stamp') {
      setIsVerifyCredentialOpen(true);
    }

    if (type === 'mint_nft') {
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
    let claimValue = credential.value;

    if (type === 'decrypt') {
      claimValue = await issuer.decryptClaimValue(credential.value);
    }

    if (type === 'encrypt') {
      claimValue = await passport.getClaimValue(credential);
    }

    const currentCredentialPosition = personhoods.findIndex(
      personhood => personhood.credential.vcId === credential.vcId
    );

    if (currentCredentialPosition === -1) return;

    if (claimValue) {
      const updatedPersnohoods = [...personhoods];
      updatedPersnohoods[currentCredentialPosition] = {
        ...updatedPersnohoods[currentCredentialPosition],
        credential: {
          ...updatedPersnohoods[currentCredentialPosition].credential,
          value: claimValue
        }
      };

      setPersonhoods(updatedPersnohoods);
    }
  };

  const formatCredentialName = (value: any) => {
    if (value?.encryptedString) return '******';

    let formattedValue = '';

    if (value?.protocol === 'Email') {
      formattedValue = formattedValue
        .concat(' / ')
        .concat(value.username)
        .concat('@')
        .concat(value.host);
    }

    if (value?.username) {
      formattedValue = formattedValue
        .concat(' / ')
        .concat('@')
        .concat(value.username);
    }

    if (value?.fullName) {
      formattedValue = formattedValue.concat(' / ').concat(value.fullName);
    }

    if (value?.id) {
      formattedValue = formattedValue.concat(' / ').concat(value.id);
    }

    if (value?.countryCode) {
      formattedValue = formattedValue
        .concat(' / ')
        .concat(`+${value?.countryCode}${value?.number}`);
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
          currentPersonhood={currentPersonhoodSelected}
          onClose={handleIsVerifyCredentialOpen}
        />
      ) : null}
      {isShareWithModalOpen ? (
        <DynamicShareWithModal
          currentPersonhood={currentPersonhoodSelected}
          onClose={handleIsShareWithModalOpen}
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
            {currentFilterOption === 'overview' && personhoods?.length !== 0 ? (
              <div
                className="person-header-text-open-new"
                onClick={() => onFilterOption('Personhood')}
              >
                <OpenInNew />
              </div>
            ) : null}
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
        <div className="cards-box">
          {isLoading ? (
            <>
              <div className="personhood-card-loading">
                <Loading type="skeleton" />
              </div>
              <div className="personhood-card-loading">
                <Loading type="skeleton" />
              </div>
            </>
          ) : personhoods?.length === 0 ? (
            new Array(2)
              .fill(constants.DEFAULT_EMPTY_CARD_PERSONHOOD)
              .map((personhood, index) => (
                <Card
                  key={index}
                  type="simple"
                  id={`personhood_${index}`}
                  isEmpty={true}
                  {...personhood}
                />
              ))
          ) : (
            personhoods.map((personhood, index) => (
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
                    {
                      title: 'Credential details',
                      onClick: () =>
                        handleCheckCredentialsURLs(
                          'ceramic',
                          'credential',
                          personhood.credential
                        )
                    },
                    personhood.stamps?.length !== 0
                      ? {
                          title: 'Stamp details',
                          onClick: () =>
                            handleCheckCredentialsURLs(
                              'polygon',
                              'tx',
                              personhood.stamps[0]
                            )
                        }
                      : undefined,
                    isAuthenticated
                      ? {
                          title: 'Share with',
                          onClick: () =>
                            handleCurrentPersonhood('share_with', personhood)
                        }
                      : undefined,
                    isAuthenticated && personhood.stamps?.length === 0
                      ? {
                          title: 'Add stamp',
                          onClick: () =>
                            handleCurrentPersonhood('add_stamp', personhood)
                        }
                      : undefined,
                    isAuthenticated && personhood.stamps?.length !== 0
                      ? {
                          title: 'Mint Stamp',
                          onClick: () =>
                            handleCurrentPersonhood('mint_nft', personhood)
                        }
                      : undefined,
                    isAuthenticated &&
                    personhood.credential?.visualInformation
                      .isEncryptedByDefault
                      ? personhood.credential?.value?.encryptedString
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
            ))
          )}
        </div>
      </Wrapper>
    </>
  );
};
