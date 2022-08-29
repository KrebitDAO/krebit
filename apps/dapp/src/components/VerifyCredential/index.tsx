import { useContext, useState } from 'react';

import { Wrapper } from './styles';
import { BoxStep } from './boxStep';
import { ArrowForward, Close } from 'components/Icons';
import { Button } from 'components/Button';
import { DiscordProvider } from 'components/Providers';
import { constants } from 'utils';
import { GeneralContext } from 'context';

interface IProps {
  onClose: () => void;
}
type IViewStatusProps = 'init' | 'steps';
type ICurrentVerifyProps =
  | {
      id: string;
      text: string;
    }
  | undefined;

export const VerifyCredential = (props: IProps) => {
  const { onClose } = props;
  const [viewStatus, setViewStatus] = useState<IViewStatusProps>('init');
  const [currentVerify, setCurrentVerify] = useState<ICurrentVerifyProps>();
  const {
    walletInformation: { ethProvider, address, wallet }
  } = useContext(GeneralContext);

  const handleViewStatus = (status: IViewStatusProps) => {
    setViewStatus(status);
  };

  const handleCurrentVerify = (value: ICurrentVerifyProps) => {
    setCurrentVerify(value);
    handleViewStatus('steps');
  };

  return (
    <Wrapper>
      <div className="verify-credential-box">
        <div className="verify-credential-box-header">
          <div className="verify-credential-box-header-content">
            {viewStatus === 'steps' && (
              <div
                className="verify-credential-box-header-content-icon"
                onClick={() => handleViewStatus('init')}
              >
                <ArrowForward />
              </div>
            )}
            <p className="verify-credential-box-header-content-title">
              {viewStatus === 'steps'
                ? `Verify ${currentVerify.text}`
                : 'Verify your credentials'}
            </p>
          </div>
          <div className="verify-credential-box-header-close" onClick={onClose}>
            <Close />
          </div>
        </div>
        {viewStatus === 'init' && (
          <div className="verify-credential-box-list">
            {constants.PERSONHOOD_CREDENTIALS.map((item, index) => (
              <div className="verify-credential-box-item" key={index}>
                <div className="verify-credential-box-item-content">
                  <div className="verify-credential-box-item-content-icon">
                    {item.icon}
                  </div>
                  <p className="verify-credential-box-item-content-text">
                    {item.text}
                  </p>
                </div>
                <div className="verify-credential-box-item-button">
                  <Button
                    text="Verify"
                    onClick={() => handleCurrentVerify(item)}
                    styleType="border"
                    borderBackgroundColor="bunting"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {viewStatus === 'steps' && (
          <div className="verify-credential-box-steps">
            {currentVerify?.id === 'discord' && (
              <DiscordProvider
                ethProvider={ethProvider}
                wallet={wallet}
                address={address}
                stepsCompleted={{ step1: false, step2: false }}
                component={({
                  handleFetchOAuth,
                  handleStampCredential,
                  currentStepsCompleted,
                  status
                }) => (
                  <>
                    <BoxStep
                      title="Step 1"
                      description="Step 1 for Discord verification"
                      form={{
                        button: {
                          text: 'Verify',
                          onClick:
                            status === 'pending' || currentStepsCompleted.step1
                              ? undefined
                              : handleFetchOAuth,
                          idDisabled:
                            status === 'pending' || currentStepsCompleted.step1
                        }
                      }}
                    />
                    <BoxStep
                      title="Step 2"
                      description="Step 2 for Discord verification"
                      form={{
                        button: {
                          text: 'Stamp',
                          onClick:
                            status === 'pending' || currentStepsCompleted.step2
                              ? undefined
                              : handleStampCredential,
                          idDisabled:
                            status === 'pending' || currentStepsCompleted.step2
                        }
                      }}
                    />
                  </>
                )}
              />
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
};
