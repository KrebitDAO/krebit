import { ChangeEvent, MouseEvent, ReactNode } from 'react';

import { BoxStepWrapper } from './styles';
import { Button } from 'components/Button';
import { Input } from 'components/Input';
import { Select, IItems } from 'components/Select';
import { Switch } from 'components/Switch';
import { Approval, Fingerprint, Timer } from 'components/Icons';
import { useWindowSize } from 'hooks';

// types
import { SelectChangeEvent } from '@mui/material';

interface IProps {
  title: string;
  description: string;
  form?: {
    fields?: {
      name: string;
      placeholder: string;
      value: string | number | boolean;
      onChange: (
        event: ChangeEvent<HTMLInputElement> | SelectChangeEvent
      ) => void;
      type?: string;
      pattern?: string;
      isDisabled?: boolean;
      isRequired?: boolean;
      items?: IItems[];
    }[];
    button?: {
      text: string;
      onClick: (event: MouseEvent<HTMLButtonElement>) => void;
      isDisabled?: boolean;
    };
  };
  isLoading?: boolean;
  loadingMessage?: string;
  isError?: boolean;
  errorMessage?: string;
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
    loadingMessage,
    isError = false,
    errorMessage,
    iconType,
    icon,
    did,
    verificationUrl,
    price
  } = props;
  const { width } = useWindowSize();

  return (
    <BoxStepWrapper>
      {isError ? (
        <p className="verify-box-error">
          {errorMessage || 'Something went wrong'}
        </p>
      ) : isLoading ? (
        <p className="verify-box-loading">{loadingMessage || 'Loading...'}</p>
      ) : (
        <>
          <div className="verify-box-step-content">
            <div className="verify-box-step-content-titles">
              <p className="verify-box-step-content-title">{title}</p>
              <p className="verify-box-step-content-description">
                {description}
              </p>
            </div>
            {iconType || icon ? (
              <div className="verify-box-step-content-icon">
                {iconType === 'credential' ? (
                  <Fingerprint />
                ) : iconType === 'stamp' ? (
                  <Approval />
                ) : iconType === 'timer' ? (
                  <Timer />
                ) : icon ? (
                  icon
                ) : null}
              </div>
            ) : null}
          </div>
          {did && verificationUrl && price ? (
            <ul className="verify-box-step-content-list">
              <li className="verify-box-step-content-description">
                <a
                  href={'/' + did}
                  target="_blank"
                  className="verify-box-step-content-description verify-box-step-content-dots"
                >
                  {did.substring(0, width > 640 ? 50 : 30) + '...'}
                </a>
              </li>
              <li className="verify-box-step-content-description">
                {verificationUrl}
              </li>
              <li className="verify-box-step-content-description">${price}</li>
            </ul>
          ) : null}
          {form?.fields && (
            <div className="verify-box-step-fields">
              {form.fields.map((input, index) => {
                if (input.type === 'select') {
                  return (
                    <Select
                      key={index}
                      id={input.name}
                      name={input.name}
                      label={input.placeholder}
                      value={input.value as string}
                      onChange={input.onChange}
                      items={input.items}
                      isDisabled={input.isDisabled}
                      isRequired={input.isRequired}
                    />
                  );
                }

                if (input.type === 'switch') {
                  return (
                    <Switch
                      key={index}
                      name={input.name}
                      label={input.placeholder}
                      value={input.value as boolean}
                      onChange={input.onChange}
                    />
                  );
                }

                return (
                  <Input
                    key={index}
                    type={(input.type as any) || 'text'}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={input.value as string | number}
                    onChange={input.onChange}
                    isDisabled={input.isDisabled}
                    isRequired={input.isRequired}
                    pattern={input.pattern}
                  />
                );
              })}
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
