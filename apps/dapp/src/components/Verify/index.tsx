import { ReactElement, ReactNode, useEffect, useState } from 'react';

import { Wrapper } from './styles';
import { ArrowForward, Close } from 'components/Icons';
import { Button } from 'components/Button';

interface IInitialListProps {
  id: string;
  text: string;
  icon: ReactNode;
  isDisabled?: boolean;
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
  verifyId?: string;
}

export const Verify = (props: IProps) => {
  const { initialList, component, onClose, verifyId } = props;
  const [viewStatus, setViewStatus] = useState<IViewStatusProps>('init');
  const [currentVerify, setCurrentVerify] = useState<
    ICurrentVerifyProps | undefined
  >();

  useEffect(() => {
    if (verifyId) {
      const currentElement = initialList.find(list => list.id === verifyId);

      if (currentElement) {
        setViewStatus('steps');
        setCurrentVerify(currentElement);
      }
    }
  }, [verifyId]);

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
            {viewStatus === 'steps' && !verifyId ? (
              <div
                className="verify-box-header-content-icon"
                onClick={() => handleViewStatus('init')}
              >
                <ArrowForward />
              </div>
            ) : null}
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
                  <Button
                    text={item.isDisabled ? 'Soon' : 'Verify'}
                    onClick={
                      item.isDisabled
                        ? undefined
                        : () => handleCurrentVerify(item)
                    }
                    styleType="border"
                    borderBackgroundColor="bunting"
                  />
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
