import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { Wrapper } from './styles';
import { VerifyCredential } from './verifyCredential';
import { QuestionModal } from 'components/QuestionModal';
import { OpenInNew } from 'components/Icons';
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
import { IProfile, ICredential } from 'utils/normalizeSchema';
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

export const Work = (props: IProps) => {
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
  const [works, setWorks] = useState<ICredential[]>([]);
  const [actionStatus, setActionStatus] = useState('idle');
  const [currentWorkSelected, setCurrentWorkSelected] = useState<ICredential>();
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
        const workCredentials = await getCredentials({
          type: 'WorkExperience',
          passport: publicPassport,
          limit: currentFilterOption === 'overview' ? 2 : 100
        });

        setWorks(workCredentials);
        handleProfile(prevValues => ({
          ...prevValues,
          skills:
            (prevValues.skills || []).concat(
              workCredentials.flatMap(credential => credential.skills)
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
    setCurrentWorkSelected({
      credential: undefined,
      stamps: [],
      isMinted: false
    });
  };

  const handleIsShareWithModalOpen = () => {
    if (!isAuthenticated) return;

    setIsShareWithModalOpen(prevState => !prevState);
    setCurrentWorkSelected({
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

  const handleCurrentWork = (type: string, values: ICredential) => {
    setCurrentWorkSelected(values);
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
    if (!currentWorkSelected) return;

    try {
      if (currentActionType === 'remove_credential') {
        setActionStatus('remove_pending');

        const response = await passport.removeCredential(
          currentWorkSelected.credential?.vcId
        );

        if (response) {
          handleIsRemoveModalOpen();
        }
      }

      if (currentActionType === 'remove_stamp') {
        setActionStatus('remove_pending');

        const response = await issuer.removeStamp(
          currentWorkSelected.stamps[0],
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

    const currentCredentialPosition = works.findIndex(
      work => work.credential.vcId === credential.vcId
    );

    if (currentCredentialPosition === -1) return;

    if (claimValue) {
      const updatedWorks = [...works];
      updatedWorks[currentCredentialPosition] = {
        ...updatedWorks[currentCredentialPosition],
        credential: {
          ...updatedWorks[currentCredentialPosition].credential,
          value: claimValue
        }
      };

      setWorks(updatedWorks);
    }
  };

  const formatCredentialName = (value: any) => {
    if (value?.encryptedString) return '******';

    let formattedValue = '';

    if (value?.entity)
      formattedValue = formattedValue.concat(' / ').concat(value.entity);
    if (value?.title)
      formattedValue = formattedValue.concat(' / ').concat(value.title);

    if (value?.username) {
      formattedValue = formattedValue
        .concat(' / ')
        .concat('@')
        .concat(value.username);
    }

    if (value?.id) {
      formattedValue = formattedValue.concat(' / ').concat(value.id);
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
          currentWork={currentWorkSelected}
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
        <div className="work-header">
          <div className="work-header-text-container">
            <p className="work-header-text">Work credentials</p>
            {currentFilterOption === 'overview' && (
              <div
                className="work-header-text-open-new"
                onClick={() => onFilterOption('WorkExperience')}
              >
                <OpenInNew />
              </div>
            )}
          </div>
          {isAuthenticated && (
            <p
              className="work-header-verify"
              onClick={handleIsVerifyCredentialOpen}
            >
              Verify
            </p>
          )}
        </div>
        <div className="work-cards">
          {isLoading ? (
            <>
              <div className="work-card-loading">
                <Loading type="skeleton" />
              </div>
              <div className="work-card-loading">
                <Loading type="skeleton" />
              </div>
            </>
          ) : works?.length === 0 ? (
            new Array(2)
              .fill(constants.DEFAULT_EMPTY_CARD_WORK)
              .map((personhood, index) => (
                <Card
                  key={index}
                  type="long"
                  id={`work_${index}`}
                  isEmpty={true}
                  {...personhood}
                />
              ))
          ) : (
            works.map((work, index) => (
              <Card
                key={index}
                type="long"
                id={`work_${index}`}
                icon={work.credential?.visualInformation?.icon}
                title={work.credential?.visualInformation?.entity}
                description={formatCredentialName(work.credential?.value)}
                dates={{
                  issuanceDate: {
                    text: 'ISSUED',
                    value: work.credential?.issuanceDate
                  },
                  expirationDate: {
                    text: 'EXPIRES',
                    value: work.credential?.expirationDate
                  }
                }}
                dropdown={{
                  isDropdownOpen,
                  onClick: () => handleIsDropdownOpen(`work_${index}`),
                  onClose: () => handleIsDropdownOpen(undefined),
                  items: [
                    !isAuthenticated
                      ? {
                          title: 'Credential details',
                          onClick: () =>
                            handleCheckCredentialsURLs(
                              'ceramic',
                              'credential',
                              work.credential
                            )
                        }
                      : undefined,
                    !isAuthenticated && work.stamps?.length !== 0
                      ? {
                          title: 'Stamp details',
                          onClick: () =>
                            handleCheckCredentialsURLs(
                              'polygon',
                              'tx',
                              work.stamps[0]
                            )
                        }
                      : undefined,
                    isAuthenticated &&
                    process.env.NEXT_PUBLIC_NETWORK === 'mumbai' &&
                    work.credential?.visualInformation.isEncryptedByDefault
                      ? {
                          title: 'Share with',
                          onClick: () => handleCurrentWork('share_with', work)
                        }
                      : undefined,
                    isAuthenticated && work.stamps?.length === 0
                      ? {
                          title: 'Add stamp',
                          onClick: () => handleCurrentWork('add_stamp', work)
                        }
                      : undefined,
                    work.credential?.visualInformation.isEncryptedByDefault
                      ? work.credential?.value?.encryptedString
                        ? {
                            title: 'Decrypt',
                            onClick: () => handleCurrentWork('decrypt', work)
                          }
                        : {
                            title: 'Encrypt',
                            onClick: () => handleCurrentWork('encrypt', work)
                          }
                      : undefined,
                    isAuthenticated && work.stamps?.length === 0
                      ? {
                          title: 'Remove credential',
                          onClick: () =>
                            handleCurrentWork('remove_credential', work)
                        }
                      : undefined,
                    isAuthenticated &&
                    work.credential &&
                    work.stamps?.length !== 0
                      ? {
                          title: 'Remove stamp',
                          onClick: () => handleCurrentWork('remove_stamp', work)
                        }
                      : undefined
                  ]
                }}
                isIssued={work.credential && work.stamps?.length > 0}
                image={
                  work.credential?.value?.imageUrl
                    ? work.credential?.value?.imageUrl
                    : work.credential?.visualInformation?.imageUrl
                }
                tooltip={{
                  message: `This credential has ${
                    work.stamps?.length || 0
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
