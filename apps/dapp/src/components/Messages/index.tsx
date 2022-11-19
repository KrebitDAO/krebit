import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ErrorWrapper from 'next/error';

import {
  LoadingWrapper,
  MessagesBoxItem,
  MessagesBoxItemImage,
  Wrapper
} from './styles';
import { Loading } from 'components/Loading';
import { ArrowForward, ArrowSend, Search } from 'components/Icons';
import { DEFAULT_PICTURE } from 'utils/normalizeSchema';
import { formatUrlImage } from 'utils';
import { GeneralContext } from 'context';
import { useWindowSize } from 'hooks';

const DEFAULT_LIMIT_PICTURES_LIST = 4;

export const Messages = () => {
  const [status, setStatus] = useState('idle');
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>();
  const [shouldShowMobileMenu, setShouldShowMobileMenu] = useState(false);
  const {
    auth,
    walletInformation: { orbis }
  } = useContext(GeneralContext);
  const { push, query } = useRouter();
  const { width } = useWindowSize();
  const isLoading = status === 'idle' || status === 'pending';
  const isMessagesLoading = status === 'pending_messages';
  const isDesktop = width >= 1024;

  useEffect(() => {
    if (auth.status !== 'resolved') return;

    const getData = async () => {
      setStatus('pending');

      try {
        if (!auth?.isAuthenticated) {
          throw new Error('Not authorized');
        }

        const { data, error } = await orbis.getConversations({
          did: auth.did
        });

        if (error) {
          console.error(error);
          setStatus('rejected');
          return;
        }

        setConversations(data || []);
        setStatus('resolved');
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getData();
  }, [orbis, auth.status, auth?.isAuthenticated]);

  useEffect(() => {
    if (auth.status !== 'resolved') return;
    if (!auth?.isAuthenticated) return;
    if (!conversations || conversations?.length === 0) return;

    const id = query?.conversation_id
      ? query?.conversation_id
      : conversations[0]?.stream_id;

    const getMessages = async () => {
      setStatus('pending_messages');

      try {
        const { data: messagesData, error: messagesError } =
          await orbis.getMessages(id);

        if (messagesError) {
          console.error(messagesError);
          setStatus('rejected_messages');
          return;
        }

        const messages = await Promise.all(
          messagesData?.map(async message => {
            const decryptMessage = await orbis.decryptMessage(message?.content);

            return { ...message, decryptMessage: decryptMessage?.result };
          })
        );

        const currentConversation = conversations.find(
          conversation => conversation?.stream_id === id
        );

        setMessages(messages || []);
        setCurrentConversation(currentConversation);
        setStatus('resolved_messages');
      } catch (error) {
        console.error(error);
        setStatus('rejected_messages');
      }
    };

    getMessages();
  }, [
    auth.status,
    auth?.isAuthenticated,
    conversations,
    query?.conversation_id
  ]);

  const handleShouldShowMobileMenu = () => {
    if (isDesktop) return;

    setShouldShowMobileMenu(prevValue => !prevValue);
  };

  const handleSelectProfile = (conversationId: string) => {
    handleShouldShowMobileMenu();

    if (conversationId) {
      push(`/messages/?conversation_id=${conversationId}`);
    } else {
      push('/messages');
    }
  };

  if (status === 'rejected') {
    return <ErrorWrapper statusCode={404} />;
  }

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }

  return (
    <>
      <style global jsx>{`
        html,
        body {
          overflow: ${shouldShowMobileMenu ? 'hidden' : 'initital'};
        }

        #nav-bar-mobile {
          display: ${shouldShowMobileMenu ? 'none' : 'grid'};
        }
      `}</style>
      <Wrapper>
        <div className="messages-container">
          <div
            className={`messages-left-side ${
              shouldShowMobileMenu ? 'messages-is-hidden' : ''
            }`}
          >
            <div className="messages-left-side-header">
              <p className="messages-left-side-header-text">Chats</p>
              <div className="messages-left-side-header-icon">
                <Search />
              </div>
            </div>
            <div className="messages-left-side-box">
              {conversations.map((conversation, index) => (
                <MessagesBoxItem
                  length={
                    conversation?.recipients_details?.length === 2
                      ? 1
                      : conversation?.recipients_details?.length >
                        DEFAULT_LIMIT_PICTURES_LIST
                      ? DEFAULT_LIMIT_PICTURES_LIST
                      : conversation?.recipients_details?.filter(
                          details => details?.did !== auth?.did
                        )?.length
                  }
                  onClick={() => handleSelectProfile(conversation?.stream_id)}
                  key={index}
                >
                  <div className="messages-box-item-images">
                    {conversation?.recipients_details
                      .filter(details => details?.did !== auth?.did)
                      .slice(0, DEFAULT_LIMIT_PICTURES_LIST)
                      .map((details, index) => (
                        <MessagesBoxItemImage
                          key={index}
                          image={
                            formatUrlImage(details?.profile?.pfp) ||
                            DEFAULT_PICTURE
                          }
                          length={
                            conversation?.recipients_details?.length === 2
                              ? 0
                              : conversation?.recipients_details?.length >
                                DEFAULT_LIMIT_PICTURES_LIST
                              ? DEFAULT_LIMIT_PICTURES_LIST
                              : index
                          }
                        />
                      ))}
                  </div>
                  <p className="messages-box-item-text">
                    {conversation?.recipients_details
                      .filter(details => details?.did !== auth?.did)
                      .slice(0, DEFAULT_LIMIT_PICTURES_LIST)
                      .map(
                        details => details?.profile?.username || details?.did
                      )
                      .join(', ')}
                    {conversation?.recipients_details?.length > 2 && '...'}
                  </p>
                </MessagesBoxItem>
              ))}
            </div>
          </div>
          <div
            className={`messages-right-side ${
              shouldShowMobileMenu ? '' : 'messages-is-hidden'
            }`}
          >
            {isMessagesLoading ? (
              <div className="messages-right-side-loading">
                <Loading />
              </div>
            ) : (
              <>
                <div className="messages-right-side-header">
                  <div
                    className="messages-right-side-header-icon"
                    onClick={() =>
                      handleSelectProfile(currentConversation?.stream_id)
                    }
                  >
                    <ArrowForward />
                  </div>
                  <MessagesBoxItem
                    length={
                      currentConversation?.recipients_details?.length === 2
                        ? 1
                        : currentConversation?.recipients_details?.length >
                          DEFAULT_LIMIT_PICTURES_LIST
                        ? DEFAULT_LIMIT_PICTURES_LIST
                        : currentConversation?.recipients_details?.filter(
                            details => details?.did !== auth?.did
                          )?.length
                    }
                    hasSpecialSpace={false}
                  >
                    <div className="messages-box-item-images">
                      {currentConversation?.recipients_details
                        .filter(details => details?.did !== auth?.did)
                        .slice(0, DEFAULT_LIMIT_PICTURES_LIST)
                        .map((details, index) => (
                          <MessagesBoxItemImage
                            key={index}
                            image={
                              formatUrlImage(details?.profile?.pfp) ||
                              DEFAULT_PICTURE
                            }
                            length={
                              currentConversation?.recipients_details
                                ?.length === 2
                                ? 0
                                : currentConversation?.recipients_details
                                    ?.length > DEFAULT_LIMIT_PICTURES_LIST
                                ? DEFAULT_LIMIT_PICTURES_LIST
                                : index
                            }
                          />
                        ))}
                    </div>
                  </MessagesBoxItem>
                </div>
                <div className="messages-right-side-chat-box">
                  <div className="messages-right-side-box">
                    {messages.map((message, index) => (
                      <p
                        className={`messages-right-side-box-item ${
                          message?.creator === auth?.did
                            ? 'messages-right-side-box-item-me'
                            : ''
                        }`}
                        key={index}
                      >
                        {message?.decryptMessage}
                      </p>
                    ))}
                  </div>
                  <div className="messages-right-box-chat">
                    <input
                      placeholder="Type your message"
                      value=""
                      onChange={() => {}}
                      name="messageValue"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <button type="button" onClick={() => {}}>
                      <ArrowSend />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};
