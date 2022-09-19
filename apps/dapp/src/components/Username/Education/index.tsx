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
import { IProfile } from 'utils/normalizeSchema';

interface IEducation {}

interface IProps {
  isAuthenticated: boolean;
  educations: IEducation[];
  passport: Passport;
  issuer: Issuer;
  handleProfile: Dispatch<SetStateAction<IProfile>>;
}

export const Education = (props: IProps) => {
  const {
    educations,
    isAuthenticated,
    passport,
    issuer,
    handleProfile
  } = props;
  const [currentEducationSelected, setCurrentEducationSelected] = useState<
    IEducation
  >();
  const [isVerifyCredentialOpen, setIsVerifyCredentialOpen] = useState(false);

  const handleIsVerifyCredentialOpen = () => {
    if (!isAuthenticated) return;

    setIsVerifyCredentialOpen(prevState => !prevState);
    setCurrentEducationSelected({
      credential: undefined,
      stamps: []
    });
  };

  return (
    <>
      {isVerifyCredentialOpen ? (
        <VerifyCredential
          currentEducation={{ credential: undefined, stamps: [] }}
          onClose={handleIsVerifyCredentialOpen}
        />
      ) : null}
      <Wrapper>
        <div className="education-header">
          <p className="education-header-text">Education credentials</p>
          {/* {isAuthenticated && (
            <p
              className="education-header-verify"
              onClick={handleIsVerifyCredentialOpen}
            >
              Verify
            </p>
          )} */}
        </div>
        <div className="education-cards">
          {new Array(2).fill(0).map((_, index) => (
            <Card
              key={index}
              type="small"
              id={`education_${index}`}
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
        <p className="education-view-more">View 7 more</p>
      </Wrapper>
    </>
  );
};
