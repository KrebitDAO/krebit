import { ReactElement, ReactNode, useState } from 'react';

import { Wrapper } from './styles';
import { ArrowForward, Close } from 'components/Icons';
import { Button } from 'components/Button';

interface IInitialListProps {
  id: string;
  text: string;
  icon: ReactNode;
  action?: {
    text?: string;
    onClick?: () => void;
  };
}
type IViewStatusProps = 'init' | 'steps';
type ICurrentVerifyProps = {
  id: string;
  text: string;
};

interface IComponentProps {
  currentVerify: ICurrentVerifyProps | undefined;
  handleCurrentVerify: (value: ICurrentVerifyProps) => void;
}

interface IProps {
  initialList: IInitialListProps[];
  onClose: () => void;
  component: (props: IComponentProps) => ReactElement;
}

export const Verify = (props: IProps) => {
  const { initialList, component, onClose } = props;
  const [viewStatus, setViewStatus] = useState<IViewStatusProps>('init');
  const [currentVerify, setCurrentVerify] = useState<
    ICurrentVerifyProps | undefined
  >();

  const handleViewStatus = (status: IViewStatusProps) => {
    setViewStatus(status);
  };

  const handleCurrentVerify = (value: ICurrentVerifyProps) => {
    setCurrentVerify(value);
    handleViewStatus('steps');
  };

  return (
    <Wrapper>
      <div className="verify-box">
        <div className="verify-box-header">
          <div className="verify-box-header-content">
            {viewStatus === 'steps' && (
              <div
                className="verify-box-header-content-icon"
                onClick={() => handleViewStatus('init')}
              >
                <ArrowForward />
              </div>
            )}
            <p className="verify-box-header-content-title">
              {viewStatus === 'steps'
                ? `Verify ${currentVerify.text}`
                : 'Verify your credentials'}
            </p>
          </div>
          <div className="verify-box-header-close" onClick={onClose}>
            <Close />
          </div>
        </div>
        {viewStatus === 'init' && (
          <div className="verify-box-list">
            {initialList.map((item, index) => (
              <div className="verify-box-item" key={index}>
                <div className="verify-box-item-content">
                  <div className="verify-box-item-content-icon">
                    {item.icon}
                  </div>
                  <p className="verify-box-item-content-text">{item.text}</p>
                </div>
                <div className="verify-box-item-button">
                  {item.action ? (
                    <Button
                      text={item.action.text}
                      onClick={item.action.onClick}
                      styleType="border"
                      borderBackgroundColor="bunting"
                    />
                  ) : (
                    <Button
                      text="Verify"
                      onClick={() => handleCurrentVerify(item)}
                      styleType="border"
                      borderBackgroundColor="bunting"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {viewStatus === 'steps' && (
          <div className="verify-box-steps">
            {component({
              currentVerify,
              handleCurrentVerify
            })}
          </div>
        )}
      </div>
    </Wrapper>
  );
};
