import { ChangeEvent, MouseEvent, ReactNode } from 'react';

import { BoxStepWrapper } from './styles';
import { Button } from 'components/Button';
import { Approval, Fingerprint } from 'components/Icons';

interface IProps {
  title: string;
  description: string;
  form?: {
    inputs?: {
      name: string;
      placeholder: string;
      value: string | number;
      onChange: (event: ChangeEvent<HTMLInputElement>) => void;
      type?: string;
      pattern?: string;
      isDisabled?: boolean;
    }[];
    button?: {
      text: string;
      onClick: (event: MouseEvent<HTMLButtonElement>) => void;
      isDisabled?: boolean;
    };
  };
  isLoading?: Boolean;
  iconType?: string;
  icon?: ReactNode;
  did?: string;
  verificationUrl?: string;
  price?: string;
}

export const BoxStep = (props: IProps) => {
  const {
    title,
    description,
    form,
    isLoading = false,
    iconType,
    icon,
    did,
    verificationUrl,
    price
  } = props;

  return (
    <BoxStepWrapper hasInputs={!!form?.inputs}>
      {isLoading ? (
        <p className="verify-box-loading">
          Approve signature on your Wallet...
        </p>
      ) : (
        <>
          <div className="verify-box-step-content">
            {icon && <div className="verify-box-step-content-icon">{icon}</div>}
            <div className="verify-box-step-content-texts">
              <p className="verify-box-step-content-title">{title}</p>

              <p className="verify-box-step-content-description">
                {description}
              </p>
              {did && (
                <div className="verify-box-step-content-description">
                  <a href={'/' + did} target="_blank">
                    {did.substring(0, 48) + '...'}
                  </a>
                </div>
              )}
              {verificationUrl && (
                <div className="verify-box-step-content-description">
                  {verificationUrl}
                </div>
              )}
              {price && (
                <div className="verify-box-step-content-description">
                  ${price}
                </div>
              )}
            </div>
            {iconType && (
              <div className="verify-box-step-content-icon">
                {iconType === 'credential' ? (
                  <Fingerprint />
                ) : iconType === 'stamp' ? (
                  <Approval />
                ) : null}
              </div>
            )}
          </div>
          {form?.inputs && (
            <div className="verify-box-step-inputs">
              {form.inputs.map((input, index) => (
                <input
                  key={index}
                  className="verify-box-step-input"
                  type={input.type || 'text'}
                  pattern={input.pattern}
                  name={input.name}
                  placeholder={input.placeholder}
                  disabled={input.isDisabled}
                  value={input.value}
                  onChange={input.onChange}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
              ))}
            </div>
          )}
          {form?.button && (
            <div className="verify-box-step-button">
              <Button
                text={form.button.text}
                onClick={form.button.onClick}
                styleType="border"
                borderBackgroundColor="bunting"
                isDisabled={form.button.isDisabled}
              />
            </div>
          )}
        </>
      )}
    </BoxStepWrapper>
  );
};
