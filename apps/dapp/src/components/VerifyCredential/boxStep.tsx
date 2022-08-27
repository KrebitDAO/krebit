import { MouseEvent } from 'react';
import { Button } from 'components/Button';

interface IProps {
  title: string;
  description: string;
  form?: {
    button: {
      text: string;
      onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    };
    input?: {
      name: string;
      placeholder: string;
    };
  };
}

export const BoxStep = (props: IProps) => {
  const { title, description, form } = props;

  return (
    <div className="verify-credential-box-step">
      <div className="verify-credential-box-step-content">
        <p className="verify-credential-box-step-content-title">{title}</p>
        <p className="verify-credential-box-step-content-description">
          {description}
        </p>
      </div>
      {form?.button && (
        <div className="verify-credential-box-step-button">
          <Button
            text={form.button.text}
            onClick={form.button.onClick}
            styleType="border"
            borderBackgroundColor="bunting"
          />
        </div>
      )}
      {form?.input && (
        <div className="verify-credential-box-step-input">
          <input
            name={form.input.name}
            placeholder={form.input.placeholder}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
        </div>
      )}
    </div>
  );
};