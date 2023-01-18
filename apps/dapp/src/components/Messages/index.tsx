import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useRouter } from 'next/router';
import ErrorWrapper from 'next/error';
import { debounce } from 'ts-debounce';

import {
  ConversationAutocompleteBox,
  LoadingWrapper,
  MessagesBoxItem,
  MessagesBoxItemImage,
  MessagesRightSideBoxMessage,
  Wrapper
} from './styles';
import { Loading } from 'components/Loading';
import {
  Add,
  ArrowForward,
  ArrowSend,
  Close,
  VideoCall,
  Deal
} from 'components/Icons';
import { QuestionModal } from 'components/QuestionModal';
import { Autocomplete } from 'components/Autocomplete';
import { Button } from 'components/Button';
import { DEFAULT_PICTURE } from 'utils/normalizeSchema';
import { formatUrlImage, orbisParseMarkdown } from 'utils';
import { GeneralContext } from 'context';
import { useWindowSize } from 'hooks';
import { theme } from 'theme';

const DEFAULT_LIMIT_PICTURES_LIST = 4;
const DEFAULT_CALL_SERVICE = 'https://iframe.huddle01.com/';

export const Messages = () => {
  const [status, setStatus] = useState('idle');
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [usernames, setUsernames] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>();
  const [usernamesSelected, setUsernamesSelected] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [shouldShowMobileMenu, setShouldShowMobileMenu] = useState(false);
  const [isAutocompleteOpen, setIsAutoCompleteOpen] = useState(false);
  const {
    auth,
    walletInformation: { orbis }
  } = useContext(GeneralContext);
  const { push, query, reload } = useRouter();
  const { width } = useWindowSize();
  const isLoading = status === 'idle' || status === 'pending';
  const isMessagesLoading = status === 'pending_messages';
  const isActionMessageLoading = status === 'pending_action_message';
  const isUsernamesLoading = status === 'pending_usernames';
  const isDesktop = width >= 1024;

  useEffect(() => {
    if (!orbis) return;
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
    if (!orbis) return;
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
    orbis,
    auth.status,
    auth?.isAuthenticated,
    conversations,
    query?.conversation_id
  ]);

  const delayedUsernames = useCallback(
    debounce(() => getUsernames(), 500),
    [
      orbis,
      auth.status,
      auth?.did,
      auth?.isAuthenticated,
      isAutocompleteOpen,
      form?.conversation_autocomplete,
      form?.conversation_input_autocomplete
    ]
  );

  useEffect(() => {
    if (!orbis) return;
    if (auth.status !== 'resolved') return;
    if (!auth?.isAuthenticated) return;
    if (!isAutocompleteOpen) return;

    delayedUsernames();

    return delayedUsernames.cancel;
  }, [
    orbis,
    auth.status,
    auth?.did,
    auth?.isAuthenticated,
    isAutocompleteOpen,
    form?.conversation_autocomplete,
    form?.conversation_input_autocomplete
  ]);

  const getUsernames = async () => {
    try {
      setStatus('pending_usernames');
      const value =
        form?.conversation_autocomplete ||
        form?.conversation_input_autocomplete;

      const usernames = await orbis.getProfilesByUsername(value);

      if (usernames.error) {
        console.error(usernames.error);
        setStatus('rejected_usernames');
        return;
      }

      const currentUsernames = usernames?.data.filter(
        values => values?.did !== auth?.did
      );
      setUsernames(currentUsernames || []);
      setStatus('resolved_usernames');
    } catch (error) {
      console.error(error);
      setStatus('rejected_usernames');
    }
  };

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isMessagesLoading) return;
    event.preventDefault();

    const { name, value } = event.target;

    setForm(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleKeyChange = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleAutoCompleteChange = (name: string, value: string) => {
    if (name === 'conversation_autocomplete' && value) {
      const username = usernames?.find(values => values?.username === value);
      setUsernamesSelected(prevValues => [...prevValues, username]);
    }

    setForm(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleAutoCompleteRemove = (value: string) => {
    setUsernamesSelected(
      prevValues => prevValues.filter(val => val?.username !== value) || []
    );
  };

  const handleIsAutoCompleteOpen = () => {
    setIsAutoCompleteOpen(prevValue => !prevValue);
  };

  const handleSendMessage = async () => {
    if (isMessagesLoading) return;

    try {
      setStatus('pending_action_message');

      const newMessage = {
        decryptMessage: form?.messageValue || '',
        creator: auth?.did
      };
      setMessages(prevValues => [newMessage, ...prevValues]);

      await orbis.sendMessage({
        conversation_id: currentConversation?.stream_id,
        body: form?.messageValue || ''
      });

      setStatus('resolved_action_message');
      setForm(prevValues => ({ ...prevValues, messageValue: '' }));
    } catch (error) {
      console.error(error);
      setStatus('rejected_action_message');
    }
  };

  const handleCreateDeal = () => {
    const recipients = currentConversation.recipients_details
      .filter(details => details?.did !== auth?.did)
      .slice(0, DEFAULT_LIMIT_PICTURES_LIST)
      .map(details => details?.metadata?.address || details?.did)
      .join(',');

    if (recipients.length > 0) {
      push(`/create/deal/?issueTo=${recipients}`);
    } else {
      push('/create/deal');
    }
  };

  const handleCreateConversation = async () => {
    if (isMessagesLoading) return;

    try {
      setStatus('pending_action_message');

      const recipients = usernamesSelected.flatMap(values => values?.did);

      const response = await orbis.createConversation({
        recipients
      });

      if (response) {
        setStatus('resolved_action_message');
        setForm(prevValues => ({
          ...prevValues,
          conversation_autocomplete: '',
          conversation_input_autocomplete: ''
        }));
        setUsernames([]);
        handleIsAutoCompleteOpen();
        reload();
      }
    } catch (error) {
      console.error(error);
      setStatus('rejected_action_message');
    }
  };

  const handleCreateVideoCall = async () => {
    if (isMessagesLoading) return;

    try {
      setStatus('pending_action_message');

      const ownerProfile = currentConversation?.recipients_details?.filter(
        values => values?.did === auth?.did
      )[0]?.profile;

      if (!ownerProfile) return;

      const newMessage = {
        decryptMessage: `${
          ownerProfile?.username
        } has made a call. You can join here: ${
          DEFAULT_CALL_SERVICE + currentConversation?.stream_id
        }`,
        creator: auth?.did
      };
      setMessages(prevValues => [newMessage, ...prevValues]);

      await orbis.sendMessage({
        conversation_id: currentConversation?.stream_id,
        body: newMessage.decryptMessage || ''
      });

      setStatus('resolved_action_message');
    } catch (error) {
      console.error(error);
      setStatus('rejected_action_message');
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

  if (!isLoading && conversations?.length === 0) {
    return (
      <Wrapper hasConversations={false}>
        <div className="not-messages">
          <img
            className="not-messages-image"
            src="/imgs/images/not-conversations.png"
          />
          <p className="not-messages-title">
            You don’t have any connections yet.
          </p>
          <div className="not-messages-button">
            <Button text="Explore profiles" onClick={() => push('/explore')} />
          </div>
        </div>
      </Wrapper>
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

        @media (min-width: ${theme.screens.lg}) {
          #nav-bar-mobile {
            display: none;
          }
        }
      `}</style>
      {isAutocompleteOpen && (
        <QuestionModal
          title="Create conversation"
          isLoading={isMessagesLoading || isActionMessageLoading}
          component={() => (
            <ConversationAutocompleteBox>
              <Autocomplete
                id="conversation-autocomplete"
                options={
                  usernames?.length > 0
                    ? usernames.map(values => values.username)
                    : []
                }
                isLoading={isUsernamesLoading}
                placeholder="Choose an username"
                value={form?.conversation_autocomplete}
                onChange={(event: any, newValue: string) =>
                  handleAutoCompleteChange(
                    'conversation_autocomplete',
                    newValue
                  )
                }
                inputValue={form?.conversation_input_autocomplete}
                onInputChange={(event: any, newValue: string) =>
                  handleAutoCompleteChange(
                    'conversation_input_autocomplete',
                    newValue
                  )
                }
              />
              <div className="conversation-autocomplete-boxes">
                {usernamesSelected?.length > 0
                  ? usernamesSelected.map((value, index) => (
                      <div
                        className="conversation-autocomplete-box"
                        key={index}
                      >
                        <div
                          className="conversation-autocomplete-box-close"
                          onClick={() =>
                            handleAutoCompleteRemove(value?.username)
                          }
                        >
                          <Close />
                        </div>
                        <p className="conversation-autocomplete-box-text">
                          {value?.username}
                        </p>
                      </div>
                    ))
                  : null}
              </div>
            </ConversationAutocompleteBox>
          )}
          continueButton={{
            text: 'Create',
            onClick:
              isMessagesLoading || isActionMessageLoading
                ? undefined
                : handleCreateConversation
          }}
          cancelButton={{
            text: 'Cancel',
            onClick:
              isMessagesLoading || isActionMessageLoading
                ? undefined
                : handleIsAutoCompleteOpen
          }}
        />
      )}
      <Wrapper>
        <div
          className={`messages-left-side ${
            shouldShowMobileMenu ? 'messages-is-hidden' : ''
          }`}
        >
          <div className="messages-left-side-header">
            <p className="messages-left-side-header-text">Chats</p>
            <div
              className="messages-left-side-header-icon"
              onClick={handleIsAutoCompleteOpen}
            >
              <Add />
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
                isActive={
                  currentConversation?.stream_id === conversation?.stream_id
                }
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
                    .map(details => details?.profile?.username || details?.did)
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
                        formatUrlImage(details?.profile?.pfp) || DEFAULT_PICTURE
                      }
                      length={
                        currentConversation?.recipients_details?.length === 2
                          ? 0
                          : currentConversation?.recipients_details?.length >
                            DEFAULT_LIMIT_PICTURES_LIST
                          ? DEFAULT_LIMIT_PICTURES_LIST
                          : index
                      }
                    />
                  ))}
              </div>
              {isDesktop && (
                <p className="messages-box-item-text">
                  {currentConversation?.recipients_details
                    .filter(details => details?.did !== auth?.did)
                    .slice(0, DEFAULT_LIMIT_PICTURES_LIST)
                    .map(details => details?.profile?.username || details?.did)
                    .join(', ')}
                  {currentConversation?.recipients_details?.length > 2 && '...'}
                </p>
              )}
            </MessagesBoxItem>
          </div>
          <div className="messages-right-side-chat-box">
            <div className="messages-right-side-box">
              {isMessagesLoading ? (
                <LoadingWrapper>
                  <Loading />
                </LoadingWrapper>
              ) : (
                messages.map((message, index) => (
                  <MessagesRightSideBoxMessage
                    key={index}
                    image={message?.creator_details?.profile?.pfp}
                  >
                    {message?.creator !== auth?.did && (
                      <div className="messages-right-side-box-item-image"></div>
                    )}
                    <p
                      className={`messages-right-side-box-item ${
                        message?.creator === auth?.did
                          ? 'messages-right-side-box-item-me'
                          : ''
                      }`}
                    >
                      {orbisParseMarkdown(
                        { body: message?.decryptMessage },
                        false
                      )}
                    </p>
                  </MessagesRightSideBoxMessage>
                ))
              )}
            </div>
            <div className="messages-right-box-chat">
              <input
                className="messages-right-box-chat-input"
                placeholder="Type your message"
                value={form?.messageValue || ''}
                onChange={handleChange}
                onKeyDown={handleKeyChange}
                name="messageValue"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                disabled={isMessagesLoading || isActionMessageLoading}
              />
              <div className="message-right-box-chat-options">
                {!form?.messageValue && (
                  <>
                    <div
                      className={`message-right-box-chat-icon ${
                        isMessagesLoading || isActionMessageLoading
                          ? 'message-right-box-chat-icon-disabled'
                          : ''
                      }`}
                      onClick={
                        isMessagesLoading || isActionMessageLoading
                          ? undefined
                          : handleCreateVideoCall
                      }
                    >
                      <VideoCall />
                    </div>
                    <div
                      className={`message-right-box-chat-icon ${
                        isMessagesLoading || isActionMessageLoading
                          ? 'message-right-box-chat-icon-disabled'
                          : ''
                      }`}
                      onClick={
                        isMessagesLoading || isActionMessageLoading
                          ? undefined
                          : handleCreateDeal
                      }
                    >
                      <Deal />
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={
                    isMessagesLoading || isActionMessageLoading
                      ? undefined
                      : handleSendMessage
                  }
                  disabled={isMessagesLoading || isActionMessageLoading}
                >
                  <ArrowSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};
