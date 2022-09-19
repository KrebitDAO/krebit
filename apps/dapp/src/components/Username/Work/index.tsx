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

interface IWork {}

interface IProps {
  isAuthenticated: boolean;
  works: IWork[];
  passport: Passport;
  issuer: Issuer;
  handleProfile: Dispatch<SetStateAction<IProfile>>;
}

export const Work = (props: IProps) => {
  const { works, isAuthenticated, passport, issuer, handleProfile } = props;
  const [currentWorkSelected, setCurrentWorkSelected] = useState<IWork>();
  const [isVerifyCredentialOpen, setIsVerifyCredentialOpen] = useState(false);

  const handleIsVerifyCredentialOpen = () => {
    if (!isAuthenticated) return;

    setIsVerifyCredentialOpen(prevState => !prevState);
    setCurrentWorkSelected({
      credential: undefined,
      stamps: []
    });
  };

  return (
    <>
      {isVerifyCredentialOpen ? (
        <VerifyCredential
          currentWork={{ credential: undefined, stamps: [] }}
          onClose={handleIsVerifyCredentialOpen}
        />
      ) : null}
      <Wrapper>
        <div className="work-header">
          <p className="work-header-text">Work credentials</p>
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
          {new Array(2).fill(0).map((_, index) => (
            <Card
              key={index}
              type="long"
              id={`work_${index}`}
              title="Job Title"
              description="Job company / May 2021 - Feb 2022"
              dates={{
                issuanceDate: {
                  text: 'ISSUED',
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
              image="/imgs/images/your-logo.png"
              tooltip={{
                message: 'testing'
              }}
            />
          ))}
        </div>
        <p className="work-view-more">View 7 more</p>
      </Wrapper>
    </>
  );
};
