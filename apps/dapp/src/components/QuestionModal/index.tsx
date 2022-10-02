import { Button } from 'components/Button';
import { Close } from 'components/Icons';
import { Loading } from 'components/Loading';
import { Wrapper } from './styles';

interface IProps {
  text: string;
  continueButton: {
    text: string;
    onClick: () => void;
  };
  cancelButton: {
    text: string;
    onClick: () => void;
  };
  isLoading?: boolean;
}

export const QuestionModal = (props: IProps) => {
  const { text, continueButton, cancelButton, isLoading = false } = props;

  return (
    <Wrapper>
      <div className="question-modal-container">
        <div className="question-modal-header">
          <p className="question-modal-header-title">Remove Credential?</p>
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
          ) : (
            <p className="question-modal-content-text">{text}</p>
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
