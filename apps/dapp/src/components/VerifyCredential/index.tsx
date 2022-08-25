import { useState } from 'react';

import { Wrapper } from './styles';
import { ArrowForward, Close } from 'components/Icons';
import { Button } from 'components/Button';
import { constants } from 'utils';

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

  const handleViewStatus = (status: IViewStatusProps) => {
    setViewStatus(status);
  };

  const handleCurrentVerify = (value: ICurrentVerifyProps) => {
    setCurrentVerify(value);
    handleViewStatus('steps');
  };

  const handleStepValidation = (id: string) => {
    console.log(id);
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
            {constants.VERIFY_CREDENTIAL_STEPS[currentVerify.id].map(
              (item, index) => (
                <div className="verify-credential-box-step" key={index}>
                  <div className="verify-credential-box-step-content">
                    <p className="verify-credential-box-step-content-title">
                      {item.title}
                    </p>
                    <p className="verify-credential-box-step-content-description">
                      {item.description}
                    </p>
                  </div>
                  {item.form?.buttonText && (
                    <div className="verify-credential-box-step-button">
                      <Button
                        text={item.form.buttonText}
                        onClick={() => handleStepValidation(item.id)}
                        styleType="border"
                        borderBackgroundColor="bunting"
                      />
                    </div>
                  )}
                  {item.form?.input && (
                    <div className="verify-credential-box-step-input">
                      <input
                        name={item.form.input.name}
                        placeholder={item.form.input.placeholder}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
};
