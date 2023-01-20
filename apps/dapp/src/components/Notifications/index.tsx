import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';

import { NotificationsCard, Wrapper } from './styles';
import { Close } from 'components/Icons';
import { Loading } from 'components/Loading';
import { GeneralContext } from 'context';
import { DEFAULT_PICTURE } from 'utils/normalizeSchema';

interface IProps {
  isModalOpen: boolean;
  onClose: (status: boolean) => void;
}

export const Notifications = (props: IProps) => {
  const { isModalOpen, onClose } = props;
  const [notificationsValues, setNotificationsValues] = useState([]);
  const [status, setStatus] = useState('idle');
  const {
    auth,
    walletInformation: { orbis },
    notifications: { count: notificationsCount, setNotificationsCount }
  } = useContext(GeneralContext);
  const isLoading = status === 'idle' || status === 'pending';

  useEffect(() => {
    if (!window) return;
    if (!orbis) return;
    if (auth.status !== 'resolved') return;
    if (!isModalOpen) return;

    const getNotifications = async () => {
      try {
        setStatus('pending');
        const values = await orbis.getNotifications({
          type: 'social'
        });

        setNotificationsValues(values?.data || []);
        setStatus('resolved');
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getNotifications();
  }, [orbis, auth.status, isModalOpen]);

  const handleOpenOrbis = (postId: string) => {
    if (!postId) return;

    window.open(`https://app.orbis.club/post/${postId}`, '_blank');
  };

  const handleClose = async () => {
    if (notificationsCount?.social > 0) {
      const readTimestamp = Math.floor(Date.now() / 1000);

      await orbis.setNotificationsReadTime('social', readTimestamp).then(() => {
        onClose(false);
        setNotificationsCount(prevValues => ({ ...prevValues, social: 0 }));
      });
    } else {
      onClose(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <style global jsx>{`
          html,
          body {
            overflow: hidden;
          }
        `}</style>
      )}
      <Wrapper isNotificationsOpen={isModalOpen}>
        <div className="notifications-background" onClick={handleClose} />
        <div className="notifications-box">
          <div className="notifications-box-header">
            <p className="notifications-box-header-title">Notifications</p>
            <div
              className="notifications-box-header-icon"
              onClick={handleClose}
            >
              <Close />
            </div>
          </div>
          {isLoading ? (
            <div className="notifications-box-loading">
              <Loading />
            </div>
          ) : (
            <div className="notifications-cards">
              {notificationsValues.map((notification, index) => (
                <React.Fragment key={index}>
                  <NotificationsCard
                    image={
                      notification?.user_notifiying_details?.profile?.pfp ||
                      DEFAULT_PICTURE
                    }
                  >
                    <div className="notifications-card-image"></div>
                    <div className="notifications-card-content">
                      <Link
                        href={`/${notification?.user_notifiying_details?.did}`}
                      >
                        <a className="notifications-card-content-title">
                          <span>
                            {
                              notification?.user_notifiying_details?.profile
                                ?.username
                            }
                          </span>
                          <span className="notifications-card-content-subtitle">
                            {notification?.family === 'reaction'
                              ? 'reacted on: '
                              : notification?.family === 'follow'
                              ? 'is follwing you.'
                              : notification?.family === 'reply_to'
                              ? 'replied: '
                              : ''}
                          </span>
                        </a>
                      </Link>
                    </div>
                  </NotificationsCard>
                  {(notification?.family === 'reaction' ||
                    notification?.family === 'reply_to') &&
                  notification?.post_details?.content?.body ? (
                    <div
                      className="notifications-child-card"
                      onClick={() =>
                        handleOpenOrbis(notification?.post_details?.stream_id)
                      }
                    >
                      <NotificationsCard
                        image={
                          notification?.post_details?.creator_details?.profile
                            ?.pfp || DEFAULT_PICTURE
                        }
                      >
                        <div className="notifications-card-image"></div>
                        <div className="notifications-card-content">
                          <div className="notifications-card-content-title">
                            <span>
                              {
                                notification?.post_details?.creator_details
                                  ?.profile?.username
                              }
                            </span>
                          </div>
                          <p className="notifications-card-content-description">
                            {notification?.post_details?.content?.body}
                          </p>
                        </div>
                      </NotificationsCard>
                    </div>
                  ) : null}
                  <hr className="notifications-divider" />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};
