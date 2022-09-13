import { useCallback, useState } from 'react';
import {
  Passport,
  Krebit as Issuer
} from '@krebitdao/reputation-passport/dist/core';

import { Wrapper } from './styles';
import { VerifyCredential } from './verifyCredential';
import { Krebit, MoreVert } from 'components/Icons';
import { InlineDropdown } from 'components/InlineDropdown';
import { ToolTip } from 'components/ToolTip';

// types
import { IPersonhood } from 'utils/normalizeSchema';
import { QuestionModal } from 'components/QuestionModal';

interface IProps {
  isAuthenticated: boolean;
  personhoods: IPersonhood[];
  passport: Passport;
  issuer: Issuer;
}

export const Personhood = (props: IProps) => {
  const { personhoods, isAuthenticated, passport, issuer } = props;
  const [currentPersonhoodSelected, setCurrentPersonhoodSelected] = useState<
    IPersonhood
  >();
  const [currentActionType, setCurrentActionType] = useState<string>();
  const [status, setStatus] = useState('idle');
  const [currentToolTipActive, setCurrentToolTipActive] = useState<
    number | undefined
  >(undefined);
  const [isDropdownOpen, setIsDropdownOpen] = useState(undefined);
  const [isVerifyCredentialOpen, setIsVerifyCredentialOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  console.log(personhoods);

  const handleCurrentToolTipActive = (index: number) => {
    setCurrentToolTipActive(index);
  };
  const handleCurrentToolTipActiveCallback = useCallback(
    handleCurrentToolTipActive,
    [currentToolTipActive]
  );

  const handleCurrentToolTipHide = () => {
    setCurrentToolTipActive(undefined);
  };
  const handleCurrentToolTipHideActiveCallback = useCallback(
    handleCurrentToolTipHide,
    [currentToolTipActive]
  );

  const handleIsDropdownOpen = (index: number | undefined) => {
    if (!isAuthenticated) return;

    if (isDropdownOpen === undefined || isDropdownOpen !== index) {
      setIsDropdownOpen(index);
    }

    if (isDropdownOpen !== undefined && isDropdownOpen === index) {
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

  const handleCurrentPersonhood = (type: string, values: IPersonhood) => {
    if (!isAuthenticated) return;

    setCurrentPersonhoodSelected(values);
    setCurrentActionType(type);

    if (type === 'add_stamp') {
      setIsVerifyCredentialOpen(true);
    }

    if (type === 'remove_credential' || type === 'remove_stamp') {
      setIsRemoveModalOpen(true);
    }

    if (type === 'decrypt') {
      handleDecryptCredential(values.credential);
    }

    handleIsDropdownOpen(undefined);
  };

  const handleRemoveAction = async () => {
    if (!currentPersonhoodSelected) return;

    try {
      let isCompleted = false;

      if (currentActionType === 'remove_credential') {
        setStatus('remove_pending');

        const response = await passport.removeCredential(
          currentPersonhoodSelected.credential?.vcId
        );

        if (response) {
          isCompleted = true;
        }
      }

      if (currentActionType === 'remove_stamp') {
        setStatus('remove_pending');

        const response = await issuer.removeStamp(
          currentPersonhoodSelected.stamps[0],
          'Stamp removed from Krebit.id'
        );

        if (response) {
          isCompleted = true;
        }
      }

      if (isCompleted) {
        handleIsRemoveModalOpen();
      }
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  const handleDecryptCredential = async (credential: any) => {
    const result = {};

    if (result) {
    }
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
          text="This action can’t be undone."
          continueButton={{
            text: 'Delete',
            onClick: handleRemoveAction
          }}
          cancelButton={{ text: 'Cancel', onClick: handleIsRemoveModalOpen }}
          isLoading={status === 'remove_pending'}
        />
      ) : null}
      <Wrapper>
        <div className="person-header">
          <p className="person-header-text">Personhood Credentials</p>
          {isAuthenticated && (
            <p
              className="person-header-verify"
              onClick={handleIsVerifyCredentialOpen}
            >
              Verify
            </p>
          )}
        </div>
        <div className="person-box">
          {personhoods.map((personhood, index) => (
            <div className="person-box-item" key={index}>
              <div className="person-box-icon">
                {personhood.credential?.visualInformation?.icon}
              </div>
              <div className="person-box-item-texts">
                <p className="person-box-item-title">
                  {personhood.credential?.visualInformation?.text}
                </p>
                <p className="person-box-item-description">*********</p>
                <div className="person-box-item-dates">
                  <div className="person-box-item-date">
                    <p className="person-box-item-date-title">ISSUED</p>
                    <p className="person-box-item-date-text">02/11/2022</p>
                  </div>
                  <div className="person-box-item-date">
                    <p className="person-box-item-date-title">EXPIRES</p>
                    <p className="person-box-item-date-text">05/12/2024</p>
                  </div>
                </div>
              </div>
              <div className="person-box-item-content">
                <div
                  className={`person-box-icon person-box-item-icon ${
                    personhood.credential && personhood.stamps?.length > 0
                      ? 'person-box-item-icon-is-active'
                      : ''
                  }`}
                  onMouseOver={() =>
                    handleCurrentToolTipActiveCallback(index + 1)
                  }
                  onMouseOut={handleCurrentToolTipHideActiveCallback}
                >
                  <Krebit />
                </div>
                {isAuthenticated && (
                  <div
                    className="person-box-more-vert"
                    onClick={() => handleIsDropdownOpen(index + 1)}
                  >
                    <MoreVert />
                  </div>
                )}
                {isDropdownOpen === index + 1 && (
                  <div className="person-box-more-vert-inline-dropdown">
                    <InlineDropdown
                      items={[
                        personhood.stamps?.length === 0
                          ? {
                              title: 'Add stamp',
                              onClick: () =>
                                handleCurrentPersonhood('add_stamp', personhood)
                            }
                          : undefined,
                        {
                          title: 'Decrypt',
                          onClick: () =>
                            handleCurrentPersonhood('decrypt', personhood)
                        },
                        personhood.stamps?.length === 0
                          ? {
                              title: 'Remove credential',
                              onClick: () =>
                                handleCurrentPersonhood(
                                  'remove_credential',
                                  personhood
                                )
                            }
                          : undefined,
                        personhood.credential && personhood.stamps?.length !== 0
                          ? {
                              title: 'Remove stamp',
                              onClick: () =>
                                handleCurrentPersonhood(
                                  'remove_stamp',
                                  personhood
                                )
                            }
                          : undefined
                      ]}
                    />
                  </div>
                )}
                {currentToolTipActive === index + 1 && (
                  <div className="person-box-item-tooltip-box">
                    <ToolTip
                      message={`This credential has ${personhood.stamps
                        ?.length || 0} stamps`}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </>
  );
};
