import { ChangeEvent, MouseEvent } from 'react';

import { BoxStepWrapper } from './styles';
import { Button } from 'components/Button';

interface IProps {
  title: string;
  description: string;
  form?: {
    inputs?: {
      name: string;
      placeholder: string;
      value: string | number;
      onChange: (event: ChangeEvent<HTMLInputElement>) => void;
      isDisabled?: boolean;
    }[];
    button?: {
      text: string;
      onClick: (event: MouseEvent<HTMLButtonElement>) => void;
      isDisabled?: boolean;
    };
  };
}

export const BoxStep = (props: IProps) => {
  const { title, description, form } = props;

  return (
    <BoxStepWrapper hasInputs={!!form?.inputs}>
      <div className="verify-credential-box-step-content">
        <p className="verify-credential-box-step-content-title">{title}</p>
        <p className="verify-credential-box-step-content-description">
          {description}
        </p>
      </div>
      {form?.inputs && (
        <div className="verify-credential-box-step-inputs">
          {form.inputs.map((input, index) => (
            <input
              key={index}
              className="verify-credential-box-step-input"
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
        <div className="verify-credential-box-step-button">
          <Button
            text={form.button.text}
            onClick={form.button.onClick}
            styleType="border"
            borderBackgroundColor="bunting"
            isDisabled={form.button.isDisabled}
          />
        </div>
      )}
    </BoxStepWrapper>
  );
};
