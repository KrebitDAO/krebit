import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Wrapper } from '../Work/styles';
import { VerifyCredential } from './../Issue/verifyCredential';
import { QuestionModal } from 'components/QuestionModal';
import { OpenInNew } from 'components/Icons';
import { Card } from 'components/Card';
import { Loading } from 'components/Loading';
import { getCredential, getCredentials } from '../utils';
import { constants, normalizeSchema } from 'utils';

// types
import { IProfile, ICredential } from 'utils/normalizeSchema';
import { Passport } from '@krebitdao/reputation-passport/dist/core/Passport';
import { Krebit as Issuer } from '@krebitdao/reputation-passport/dist/core/Krebit';
import { Orbis } from '@orbisclub/orbis-sdk';

interface IProps {
  isAuthenticated: boolean;
  passport: Passport;
  publicPassport: Passport;
  issuer: Issuer;
  orbis: Orbis;
  currentFilterOption: string;
  onFilterOption: (value: string) => void;
  isHidden: boolean;
  handleProfile: Dispatch<SetStateAction<IProfile>>;
}

export const Review = (props: IProps) => {
  const {
    isAuthenticated,
    passport,
    publicPassport,
    issuer,
    orbis,
    currentFilterOption,
    onFilterOption,
    isHidden,
    handleProfile
  } = props;
  const [status, setStatus] = useState('idle');
  const [reviews, setReviews] = useState<ICredential[]>([]);
  const [actionStatus, setActionStatus] = useState('idle');
  const [currentReviewSelected, setCurrentReviewSelected] =
    useState<ICredential>();
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
      let reviewCredentials = await getCredentials({
        type: 'Review',
        passport: publicPassport,
        limit: currentFilterOption === 'overview' ? 3 : 100
      });
      reviewCredentials = await Promise.all(
        reviewCredentials.map(async values => {
          let issuerCredentialDID =
            values?.credential?.value?.values?.onBehalveOfIssuer?.id;

          if (issuerCredentialDID) {
            let profile = await normalizeSchema.profile({
              orbis,
              did: issuerCredentialDID
            });

            return {
              ...values,
              credential: {
                ...values?.credential,
                visualInformation: {
                  ...values?.credential?.visualInformation,
                  metadata: {
                    ...values?.credential?.visualInformation?.metadata,
                    profile
                  }
                }
              }
            };
          }

          return values;
        })
      );

      setReviews(reviewCredentials);
      handleProfile(prevValues => ({
        ...prevValues,
        skills:
          (prevValues.skills || [])?.concat(
            reviewCredentials.flatMap(credential => credential.skills)
          ) || []
      }));
      setStatus('resolved');
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  const updateSelectedCredential = async (vcId: string) => {
    if (!vcId) return;

    const communityCredential = await getCredential({
      vcId,
      type: 'Review',
      passport: publicPassport
    });

    setCurrentReviewSelected(communityCredential);
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
    setCurrentReviewSelected({
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

  const handleCurrentReview = (type: string, values: ICredential) => {
    setCurrentReviewSelected(values);
    setCurrentActionType(type);

    if (type === 'see_details') {
      setIsVerifyCredentialOpen(true);
    }

    if (type === 'add_stamp') {
      if (!isAuthenticated) return;
      setIsVerifyCredentialOpen(true);
    }

    if (type === 'remove_credential' || type === 'remove_stamp') {
      if (!isAuthenticated) return;
      setIsRemoveModalOpen(true);
    }

    handleIsDropdownOpen(undefined);
  };

  const handleRemoveAction = async () => {
    if (!currentReviewSelected) return;

    try {
      if (currentActionType === 'remove_credential') {
        setActionStatus('remove_pending');

        const response = await passport.removeCredential(
          currentReviewSelected.credential?.vcId
        );

        if (response) {
          await getInformation();
          handleIsRemoveModalOpen();
        }
      }

      if (currentActionType === 'remove_stamp') {
        setActionStatus('remove_pending');

        const response = await issuer.removeStamp(
          currentReviewSelected.stamps[0],
          'Stamp removed from Krebit.id'
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
    push('/create/review');
  };

  return (
    <>
      {isVerifyCredentialOpen ? (
        <VerifyCredential
          isAuthenticated={isAuthenticated}
          credential={currentReviewSelected}
          onClose={handleIsVerifyCredentialOpen}
          getInformation={getInformation}
          updateCredential={updateSelectedCredential}
          readOnly={!isAuthenticated && currentActionType === 'see_details'}
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
        <div id="review-header" className="work-header">
          <div className="work-header-text-container">
            <p className="work-header-text">Review credentials</p>
            {currentFilterOption === 'overview' && (
              <div
                className="work-header-text-open-new"
                onClick={() => onFilterOption('Review')}
              >
                <OpenInNew />
              </div>
            )}
          </div>
          {isAuthenticated && (
            <p
              className="work-header-verify"
              onClick={hadleMoveToCredentialBuilder}
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
          ) : reviews?.length === 0 ? (
            new Array(2)
              .fill(constants.DEFAULT_EMPTY_CARD_WORK)
              .map((personhood, index) => (
                <Card
                  key={index}
                  type="long"
                  id={`review_${index}`}
                  isEmpty={true}
                  {...personhood}
                />
              ))
          ) : (
            reviews.map((review, index) => (
              <Card
                key={index}
                type="long"
                id={`review_${index}`}
                icon={review?.credential?.visualInformation?.metadata?.icon}
                title={review?.credential?.visualInformation?.metadata?.title}
                description={
                  review?.credential?.visualInformation?.metadata?.description
                }
                dates={{
                  issuanceDate: {
                    text: 'ISSUED',
                    value: review.credential?.issuanceDate
                  },
                  expirationDate: {
                    text: 'EXPIRES',
                    value: review.credential?.expirationDate
                  }
                }}
                dropdown={{
                  isDropdownOpen,
                  onClick: () => handleIsDropdownOpen(`review_${index}`),
                  onClose: () => handleIsDropdownOpen(undefined),
                  items: [
                    {
                      title: 'See details',
                      onClick: () => handleCurrentReview('see_details', review)
                    },
                    isAuthenticated && review.stamps?.length === 0
                      ? {
                          title: 'Remove credential',
                          onClick: () =>
                            handleCurrentReview('remove_credential', review)
                        }
                      : undefined,
                    isAuthenticated &&
                    review.credential &&
                    review.stamps?.length !== 0
                      ? {
                          title: 'Remove stamp',
                          onClick: () =>
                            handleCurrentReview('remove_stamp', review)
                        }
                      : undefined
                  ]
                }}
                isIssued={review.credential && review.stamps?.length > 0}
                image={
                  review?.credential?.visualInformation?.metadata?.profile
                    ?.picture
                }
                rating={review?.credential?.visualInformation?.metadata?.rating}
                tooltip={{
                  message: `This credential has ${
                    review.stamps?.length || 0
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
