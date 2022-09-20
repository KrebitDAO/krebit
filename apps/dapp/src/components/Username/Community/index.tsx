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
import { IProfile, ICommunity } from 'utils/normalizeSchema';

interface IProps {
  isAuthenticated: boolean;
  communities: ICommunity[];
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
    ICommunity
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

  const handleCurrentCommunity = (type: string, values: ICommunity) => {
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

  return (
    <>
      {isVerifyCredentialOpen ? (
        <VerifyCredential
          currentCommunity={{ credential: undefined, stamps: [] }}
          onClose={handleIsVerifyCredentialOpen}
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
          {new Array(2).fill(0).map((_, index) => (
            <Card
              key={index}
              type="small"
              id={`community_${index}`}
              title="Institution Title"
              description="Institution company"
              dates={{
                issuanceDate: {
                  text: 'ISSUED',
                  value: '02/11/2022'
                },
                expirationDate: {
                  text: 'EXPIRES',
                  value: '02/11/2022'
                }
              }}
              dropdown={{
                isDropdownOpen: undefined,
                onClick: () => {},
                onClose: () => {},
                items: [
                  {
                    title: 'test',
                    onClick: () => {}
                  },
                  {
                    title: 'test',
                    onClick: () => {}
                  },
                  {
                    title: 'test',
                    onClick: () => {}
                  }
                ]
              }}
              isIssued={false}
              image="/imgs/images/testing_logo.png"
              tooltip={{
                message: 'testing'
              }}
            />
          ))}
        </div>
        <p className="Community-view-more">View 7 more</p>
      </Wrapper>
    </>
  );
};
