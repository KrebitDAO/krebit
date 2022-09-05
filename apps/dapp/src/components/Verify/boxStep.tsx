import { ChangeEvent, MouseEvent } from 'react';

import { BoxStepWrapper } from './styles';
import { Button } from 'components/Button';
import { Loading } from 'components/Loading';

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
      isDisabled?: boolean;
    }[];
    button?: {
      text: string;
      onClick: (event: MouseEvent<HTMLButtonElement>) => void;
      isDisabled?: boolean;
    };
  };
  isLoading?: Boolean;
}

export const BoxStep = (props: IProps) => {
  const { title, description, form, isLoading = false } = props;

  return (
    <BoxStepWrapper hasInputs={!!form?.inputs}>
      {isLoading ? (
        <p className="verify-box-loading">Loading...</p>
      ) : (
        <>
          <div className="verify-box-step-content">
            <p className="verify-box-step-content-title">{title}</p>
            <p className="verify-box-step-content-description">{description}</p>
          </div>
          {form?.inputs && (
            <div className="verify-box-step-inputs">
              {form.inputs.map((input, index) => (
                <input
                  key={index}
                  className="verify-box-step-input"
                  type={input.type || 'text'}
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
