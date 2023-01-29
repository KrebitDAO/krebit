import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Wrapper } from '../Community/styles';
import { VerifyCredential } from './verifyCredential';
import { QuestionModal } from 'components/QuestionModal';
import { OpenInNew } from 'components/Icons';
import { Card } from 'components/Card';
import { Loading } from 'components/Loading';
import { constants, isValidJSON, sortByDate } from 'utils';
import { formatCredential } from '../utils';
import { CREDENTIALS_INITIAL_STATE } from '../../Credentials/initialState';

// types
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';
import { IProfile, ICredential } from 'utils/normalizeSchema';

interface IProps {
  isAuthenticated: boolean;
  passport: Passport;
  publicPassport: Passport;
  currentFilterOption: string;
  onFilterOption: (value: string) => void;
  isHidden: boolean;
  handleProfile: Dispatch<SetStateAction<IProfile>>;
}

const DEFAULT_CREDENTIAL_TYPE = 'Issuer';

export const Issue = (props: IProps) => {
  const {
    isAuthenticated,
    passport,
    publicPassport,
    currentFilterOption,
    onFilterOption,
    isHidden,
    handleProfile
  } = props;
  const [status, setStatus] = useState('idle');
  const [issues, setIssues] = useState<any[]>([]);
  const [actionStatus, setActionStatus] = useState('idle');
  const [currentIssueSelected, setCurrentIssueSelected] = useState<any>();
  const [currentActionType, setCurrentActionType] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(undefined);
  const [isVerifyCredentialOpen, setIsVerifyCredentialOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const { push } = useRouter();
  const isLoading = status === 'idle' || status === 'pending';
  const isCurrentUserAuthenticated = Boolean(passport?.did);

  useEffect(() => {
    if (!window) return;
    if (!publicPassport) return;
    if (!publicPassport?.idx) return;
    if (isHidden) return;

    getInformation();
  }, [publicPassport, currentFilterOption, isHidden]);

  const getInformation = async () => {
    setStatus('pending');
    // This is a temporary solution to determine if this component is loading or not, passing skills as undefined
    handleProfile(prevValues => ({
      ...prevValues,
      skills: undefined
    }));

    try {
      const credentials = (await publicPassport.getIssued())
        .sort((a, b) => sortByDate(a.issuanceDate, b.issuanceDate, 'des'))
        .slice(0, currentFilterOption === 'overview' ? 4 : 100);

      const currentCredentials = credentials
        .map(credential => {
          let parsedCredential = {
            ...credential,
            credentialSubject: {
              ...credential?.credentialSubject,
              value: isValidJSON(credential?.credentialSubject?.value)
                ? JSON.parse(credential?.credentialSubject?.value)
                : credential?.credentialSubject?.value
            }
          };

          const visualInformation = CREDENTIALS_INITIAL_STATE.find(
            state =>
              credential?.credentialSubject?.type?.toLowerCase() ===
              state.type.toLowerCase()
          );
          const title = formatCredential(parsedCredential, 'title');
          const description = formatCredential(parsedCredential, 'description');
          const image = formatCredential(parsedCredential, 'image');
          const icon = formatCredential(parsedCredential, 'icon');

          if (visualInformation) {
            return {
              ...credential,
              credentialType: DEFAULT_CREDENTIAL_TYPE,
              visualInformation: {
                ...visualInformation,
                metadata: {
                  title,
                  description,
                  image,
                  icon
                }
              }
            };
          }

          return {
            ...credential,
            credentialType: DEFAULT_CREDENTIAL_TYPE,
            visualInformation: {
              metadata: {
                title,
                description,
                image,
                icon
              }
            }
          };
        })
        ?.filter(credential => !credential?.credentialSubject?.value?.removed);

      setIssues(currentCredentials);
      handleProfile(prevValues => ({
        ...prevValues,
        skills:
          (prevValues.skills || [])?.concat(
            currentCredentials.flatMap(credential => credential?.type)
          ) || []
      }));
      setStatus('resolved');
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  const handleIsDropdownOpen = (id: string) => {
    if (isDropdownOpen === undefined || isDropdownOpen !== id) {
      setIsDropdownOpen(id);
    }

    if (isDropdownOpen !== undefined && isDropdownOpen === id) {
      setIsDropdownOpen(undefined);
    }
  };

  const handleIsVerifyCredentialOpen = () => {
    setIsVerifyCredentialOpen(prevState => !prevState);
    setCurrentIssueSelected({
      credential: undefined,
      stamps: [],
      isMinted: false
    });
  };

  const handleIsRemoveModalOpen = () => {
    if (!isAuthenticated) return;

    setIsRemoveModalOpen(prevState => !prevState);
    setActionStatus('idle');
  };

  const handleCurrentIssue = (type: string, values: ICredential) => {
    setCurrentIssueSelected(values);
    setCurrentActionType(type);

    if (type === 'see_details') {
      setIsVerifyCredentialOpen(true);
    }

    if (type === 'remove_credential') {
      if (!isAuthenticated) return;
      setIsRemoveModalOpen(true);
    }

    handleIsDropdownOpen(undefined);
  };

  const handleRemoveAction = async () => {
    if (!currentIssueSelected) return;

    try {
      if (currentActionType === 'remove_credential') {
        setActionStatus('remove_pending');

        const response = await passport.removeCredential(
          currentIssueSelected.vcId
        );

        if (response) {
          await getInformation();
          handleIsRemoveModalOpen();
        }
      }
    } catch (error) {
      console.error(error);
      setActionStatus('rejected');
    }
  };

  const hadleMoveToCredentialBuilder = () => {
    push('/create');
  };

  return (
    <>
      {isVerifyCredentialOpen ? (
        <VerifyCredential
          isAuthenticated={isAuthenticated}
          credential={{
            credential: currentIssueSelected,
            stamps: [],
            skills: currentIssueSelected?.type || [],
            isMinted: false
          }}
          onClose={handleIsVerifyCredentialOpen}
        />
      ) : null}
      {isRemoveModalOpen ? (
        <QuestionModal
          title="Remove Credential?"
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
            <p className="community-header-text">Issued credentials</p>
            {currentFilterOption === 'overview' && (
              <div
                className="community-header-text-open-new"
                onClick={() => onFilterOption('Issue')}
              >
                <OpenInNew />
              </div>
            )}
          </div>
          {isAuthenticated && (
            <p
              className="community-header-verify"
              onClick={hadleMoveToCredentialBuilder}
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
          ) : issues?.length === 0 ? (
            new Array(2)
              .fill(constants.DEFAULT_EMPTY_CARD_COMMUNITY)
              .map((issue, index) => (
                <Card
                  key={index}
                  type="small"
                  id={`community_${index}`}
                  isEmpty={true}
                  {...issue}
                />
              ))
          ) : (
            issues.map((issue, index) => (
              <Card
                key={index}
                type="small"
                id={`issue_${index}`}
                title={issue?.visualInformation?.metadata?.title}
                description={issue?.visualInformation?.metadata?.description}
                icon={issue?.visualInformation?.metadata?.icon}
                dates={{
                  issuanceDate: {
                    text: 'ISSUED',
                    value: issue?.issuanceDate
                  },
                  expirationDate: {
                    text: 'EXPIRES',
                    value: issue?.expirationDate
                  }
                }}
                dropdown={{
                  isDropdownOpen,
                  onClick: () => handleIsDropdownOpen(`issue_${index}`),
                  onClose: () => handleIsDropdownOpen(undefined),
                  items: [
                    {
                      title: 'See details',
                      onClick: () => handleCurrentIssue('see_details', issue)
                    },
                    isAuthenticated
                      ? {
                          title: 'Remove credential',
                          onClick: () =>
                            handleCurrentIssue('remove_credential', issue)
                        }
                      : undefined
                  ]
                }}
                image={issue?.visualInformation?.metadata?.image}
                builderCredential={
                  issue?.visualInformation?.primaryColor
                    ? issue?.visualInformation
                    : undefined
                }
              />
            ))
          )}
        </div>
      </Wrapper>
    </>
  );
};
