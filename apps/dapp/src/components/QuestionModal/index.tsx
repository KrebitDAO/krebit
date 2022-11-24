import { ReactElement } from 'react';

import { Wrapper } from './styles';
import { Button } from 'components/Button';
import { Close } from 'components/Icons';
import { Loading } from 'components/Loading';

interface IProps {
  title: string;
  continueButton: {
    text: string;
    onClick: () => void;
  };
  cancelButton: {
    text: string;
    onClick: () => void;
  };
  text?: string;
  isLoading?: boolean;
  component?: () => ReactElement;
}

export const QuestionModal = (props: IProps) => {
  const {
    title,
    continueButton,
    cancelButton,
    text,
    isLoading = false,
    component
  } = props;

  return (
    <Wrapper>
      <div className="question-modal-container">
        <div className="question-modal-header">
          <p className="question-modal-header-title">{title}</p>
          <div
            className="question-modal-header-close"
            onClick={isLoading ? undefined : cancelButton.onClick}
          >
            <Close />
          </div>
        </div>
        <div className="question-modal-content">
          {isLoading ? (
            <div className="question-modal-content-loading">
              <Loading />
            </div>
          ) : text ? (
            <p className="question-modal-content-text">{text}</p>
          ) : (
            component()
          )}
        </div>
        <div className="question-modal-content-buttons">
          <div className="question-modal-content-button">
            <Button
              text={cancelButton.text}
              onClick={isLoading ? undefined : cancelButton.onClick}
              styleType="border"
              borderBackgroundColor="bunting"
              isDisabled={isLoading}
            />
          </div>
          <div className="question-modal-content-button">
            <Button
              text={continueButton.text}
              onClick={isLoading ? undefined : continueButton.onClick}
              isDisabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
