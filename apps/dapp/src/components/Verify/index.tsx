import { ReactElement, ReactNode, useEffect, useState } from 'react';

import { Wrapper } from './styles';
import { ArrowForward, Close } from 'components/Icons';
import { Button } from 'components/Button';
import { Badge } from 'components/Badge';

interface IInitialListProps {
  credentialType: string;
  entity: string;
  description: string;
  icon: ReactNode;
  imageUrl: string;
  verificationUrl: string;
  did: string;
  address: string;
  price: string;
  isDisabled?: boolean;
  badgeText?: string;
  badgeColor?: string;
  badgeIconColor?: string;
}
type IViewStatusProps = 'init' | 'steps';
type ICurrentIssuerProps = {
  credentialType: string;
  entity: string;
  description: string;
  icon: ReactNode;
  imageUrl: string;
  verificationUrl: string;
  did: string;
  address: string;
  price: string;
};

interface IComponentProps {
  currentVerify: ICurrentIssuerProps | undefined;
  handleCurrentVerify: (value: ICurrentIssuerProps) => void;
}

interface IProps {
  initialList: IInitialListProps[];
  onClose: (credentialType: string) => void;
  onClean: (credentialType: string) => void;
  component: (props: IComponentProps) => ReactElement;
  verifyId?: string;
}

export const Verify = (props: IProps) => {
  const { initialList, component, onClose, onClean, verifyId } = props;
  const [viewStatus, setViewStatus] = useState<IViewStatusProps>('init');
  const [currentVerify, setCurrentVerify] = useState<
    ICurrentIssuerProps | undefined
  >();

  useEffect(() => {
    if (verifyId) {
      const currentElement = initialList.find(
        list => list.credentialType === verifyId
      );

      if (currentElement) {
        setViewStatus('steps');
        setCurrentVerify(currentElement);
      }
    }
  }, [verifyId]);

  const handleViewStatus = (status: IViewStatusProps) => {
    if (status === 'init') {
      onClean(currentVerify.credentialType);
    }

    setViewStatus(status);
  };

  const handleCurrentVerify = (value: ICurrentIssuerProps) => {
    setCurrentVerify(value);
    handleViewStatus('steps');
  };

  return (
    <>
      <style global jsx>{`
        html,
        body {
          overflow: hidden;
        }
      `}</style>
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
                  ? `Verify ${currentVerify.entity}`
                  : 'Verify your credentials'}
              </p>
            </div>
            <div
              className="verify-box-header-close"
              onClick={() => onClose(currentVerify?.credentialType)}
            >
              <Close />
            </div>
          </div>
          {viewStatus === 'init' && (
            <div className="verify-box-list">
              {initialList.map((item, index) => (
                <div className="verify-box-item" key={index}>
                  <div className="verify-box-item-content">
                    <div className="verify-box-item-content-icon">
                      {item.badgeText ? (
                        <Badge
                          icon={item.icon}
                          text={item.badgeText}
                          color={item.badgeColor}
                          iconColor={item.badgeIconColor}
                        />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <p className="verify-box-item-content-text">
                      {item.entity}
                    </p>
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
    </>
  );
};
