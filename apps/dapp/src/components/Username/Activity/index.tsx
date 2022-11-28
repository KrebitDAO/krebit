import { ChangeEvent, useContext, useEffect, useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { useRouter } from 'next/router';

import { Wrapper } from './styles';
import { ContentCard } from 'components/Groups/styles';
import { Loading } from 'components/Loading';
import { Input } from 'components/Input';
import { InlineDropdown } from 'components/InlineDropdown';
import { QuestionModal } from 'components/QuestionModal';
import { MoreVert, OpenInNew } from 'components/Icons';
import { constants, orbisParseMarkdown } from 'utils';
import { DEFAULT_PICTURE } from 'utils/normalizeSchema';
import { substring } from 'components/Groups/utils';
import { DEFAULT_CHARACTER_LIMIT } from 'utils/orbisParseMarkdown';
import { GeneralContext } from 'context';
import { useWindowSize } from 'hooks';

// types
import {
  IDropdownPostOpened,
  IGroupForm,
  IPostActionOpened
} from 'components/Groups';

interface IProps {
  did: string;
  currentFilterOption: string;
  onFilterOption: (value: string) => void;
  isHidden: boolean;
  ensDomain: string;
  unsDomain: string;
}

export const Activity = (props: IProps) => {
  const {
    did,
    currentFilterOption,
    onFilterOption,
    isHidden,
    ensDomain,
    unsDomain
  } = props;
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState<IGroupForm>({});
  const [posts, setPosts] = useState([]);
  const [dropdownPostOpened, setDropdownPostOpened] =
    useState<IDropdownPostOpened>();
  const [postActionOpened, setPostActionOpened] = useState<IPostActionOpened>();
  const {
    auth,
    walletModal: { handleOpenConnectWallet },
    walletInformation: { orbis }
  } = useContext(GeneralContext);
  const { push } = useRouter();
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const isLoading = status === 'idle' || status === 'pending';
  const isPostActionLoading = status === 'pending_post';
  const isEmpty = !isLoading && posts?.length === 0;

  useEffect(() => {
    if (!window) return;
    if (!orbis) return;
    if (!did) return;

    const getPosts = async () => {
      try {
        setStatus('pending');

        const { data, error } = await orbis.getPosts({
          did
        });

        if (error) {
          console.error(error);
          setPosts([]);
          setStatus('rejected');
          return;
        }

        setPosts(data);
        setStatus('resolved');
      } catch (error) {
        console.error(error);
        setStatus('rejected');
      }
    };

    getPosts();
  }, [did, orbis]);

  const handleShowPost = (post: any) => {
    if (!post) return;

    const postId = post?.type === 'reply' ? post?.master : post?.stream_id;

    if (post?.context_details?.group_id === constants.DEFAULT_GROUP_ID) {
      if (post?.context_details?.channel_id) {
        push(
          `/posts/?channel_id=${post?.context_details?.channel_id}&post_id=${postId}`
        );
      } else {
        push(`/posts/?post_id=${postId}`);
      }
    } else {
      window.open(`https://app.orbis.club/post/${postId}`, '_blank');
    }
  };

  const handleActionPost = async () => {
    try {
      if (!auth?.did) {
        handleOpenConnectWallet();
        return;
      }

      if (!postActionOpened) return;

      setStatus('pending_post');

      if (postActionOpened?.type === 'edit') {
        if (!form?.edit_post) return;

        const indexPost = posts.findIndex(
          post => post?.stream_id === postActionOpened?.id
        );

        if (indexPost === -1) return;

        await orbis.editPost(postActionOpened?.id, { body: form?.edit_post });

        const updatedPost = {
          ...posts[indexPost],
          content: {
            ...posts[indexPost]?.content,
            body: form?.edit_post
          }
        };
        setPosts(prevValues => {
          let values = [...prevValues];
          values[indexPost] = updatedPost;

          return values;
        });

        handleCleanForm('edit_post', '');
        handlePostActionOpened(undefined);
        setStatus('resolved_post');
      }

      if (postActionOpened?.type === 'delete') {
        const indexPost = posts.findIndex(
          post => post?.stream_id === postActionOpened?.id
        );

        if (indexPost === -1) return;

        await orbis.deletePost(postActionOpened?.id);

        setPosts(prevValues => [
          ...prevValues.slice(0, indexPost),
          ...prevValues.slice(indexPost + 1)
        ]);

        handlePostActionOpened(undefined);
        setStatus('resolved_post');
      }
    } catch (error) {
      console.error(error);
      setStatus('pending_error');
    }
  };

  const handleDropdownPostOpened = (postId: string, type?: string) => {
    setDropdownPostOpened({ postId, type });
  };

  const handlePostActionOpened = (value: IPostActionOpened) => {
    if (!auth?.did) {
      handleOpenConnectWallet();
      return;
    }

    setPostActionOpened(value);
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    event?.preventDefault();
    const { name, value } = event.target;

    setForm(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleCleanForm = (name: string, value?: string) => {
    if (!name) {
      setForm(undefined);
    }

    setForm(prevValues => ({ ...prevValues, [name]: value }));
  };

  return (
    <>
      {postActionOpened?.type === 'edit' && (
        <QuestionModal
          title="Edit post"
          component={() => (
            <Input
              name="edit_post"
              placeholder="Enter value"
              value={form?.edit_post}
              onChange={handleChange}
              isMultiline={true}
            />
          )}
          continueButton={{
            text: 'Save',
            onClick: handleActionPost
          }}
          cancelButton={{
            text: 'Cancel',
            onClick: () => handlePostActionOpened(undefined)
          }}
          isLoading={isPostActionLoading}
        />
      )}
      {postActionOpened?.type === 'delete' && (
        <QuestionModal
          title="Delete post"
          text="Are you sure you want to delete this post?"
          continueButton={{
            text: 'Delete',
            onClick: handleActionPost
          }}
          cancelButton={{
            text: 'Cancel',
            onClick: () => handlePostActionOpened(undefined)
          }}
          isLoading={isPostActionLoading}
        />
      )}
      <Wrapper isHidden={isHidden} isEmpty={isEmpty}>
        <div className="activity-header">
          <p className="activity-header-text">Activity posts</p>
          {currentFilterOption === 'overview' && (
            <div
              className="activity-header-text-open-new"
              onClick={() => onFilterOption('Activity')}
            >
              <OpenInNew />
            </div>
          )}
        </div>
        <div className="activity-cards">
          {isLoading ? (
            <>
              <div className="activity-card-loading">
                <Loading type="skeleton" />
              </div>
              <div className="activity-card-loading">
                <Loading type="skeleton" />
              </div>
            </>
          ) : (
            posts
              ?.slice(0, currentFilterOption === 'overview' ? 3 : undefined)
              .map((activity, index) => (
                <ContentCard
                  image={
                    activity?.creator_details?.profile?.pfp || DEFAULT_PICTURE
                  }
                  replyToImage={
                    activity?.reply_to_creator_details?.profile?.pfp ||
                    DEFAULT_PICTURE
                  }
                  key={index}
                >
                  {activity?.reply_to_details && (
                    <div className="content-card-reply-to">
                      <div className="content-card-reply-to-icon"></div>
                      <div
                        className="content-card-reply-to-main"
                        onClick={() => handleShowPost(activity)}
                      >
                        <div className="content-card-reply-to-main-image"></div>
                        <div className="content-card-reply-to-main-texts">
                          <p className="content-card-reply-to-main-texts-title">
                            {substring(
                              activity?.reply_to_creator_details?.profile
                                ?.username,
                              20
                            ) ||
                              substring(
                                activity?.reply_to_creator_details?.did,
                                isDesktop ? 20 : 10,
                                true
                              )}{' '}
                            <span>
                              {activity?.reply_to_details?.body?.length > 70
                                ? `${substring(
                                    activity?.reply_to_details?.body,
                                    70
                                  )}...`
                                : activity?.reply_to_details?.body}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="content-card-main">
                    <div className="content-card-image"></div>
                    <div className="content-card-information">
                      <div
                        className="content-card-information-title"
                        onClick={() => handleShowPost(activity)}
                      >
                        <span>
                          {substring(
                            activity?.creator_details?.profile?.username,
                            20
                          ) ||
                            substring(
                              activity?.creator_details?.did,
                              isDesktop ? 20 : 10,
                              true
                            )}{' '}
                          {activity?.timestamp ? (
                            <span className="timestamp">
                              {formatDistance(
                                activity?.timestamp * 1000,
                                new Date(),
                                { addSuffix: true }
                              )}
                            </span>
                          ) : (
                            <span className="timestamp">Now</span>
                          )}
                          <OpenInNew />
                        </span>
                        {ensDomain || unsDomain ? (
                          <div className="content-card-information-title-boxes">
                            {ensDomain && <span>{ensDomain}</span>}
                            {unsDomain && <span>{unsDomain}</span>}
                          </div>
                        ) : null}
                      </div>
                      <p className="content-card-information-description">
                        {orbisParseMarkdown(activity?.content)}{' '}
                        {activity?.content?.body?.length >
                        DEFAULT_CHARACTER_LIMIT ? (
                          <span
                            className="view-more"
                            onClick={() => handleShowPost(activity)}
                          >
                            View more
                          </span>
                        ) : null}
                      </p>
                      <div className="content-card-information-actions">
                        <div className="content-card-information-action"></div>
                        <div className="content-card-information-action">
                          {activity?.creator_details?.did === auth?.did && (
                            <div
                              className="content-card-information-action-option"
                              onClick={() =>
                                handleDropdownPostOpened(activity?.stream_id)
                              }
                            >
                              <MoreVert />
                            </div>
                          )}
                          <div
                            className="content-card-information-action-option"
                            onClick={() => handleShowPost(activity)}
                          >
                            <img src="/imgs/logos/orbis.png" />
                          </div>
                        </div>
                        {dropdownPostOpened?.postId === activity?.stream_id &&
                        !dropdownPostOpened?.type ? (
                          <div className="content-card-information-action-dropdown">
                            <InlineDropdown
                              items={[
                                {
                                  title: 'Edit post',
                                  onClick: () =>
                                    handlePostActionOpened({
                                      id: activity?.stream_id,
                                      type: 'edit'
                                    })
                                },
                                {
                                  title: 'Delete post',
                                  onClick: () =>
                                    handlePostActionOpened({
                                      id: activity?.stream_id,
                                      type: 'delete'
                                    })
                                }
                              ]}
                              onClose={() =>
                                handleDropdownPostOpened(undefined)
                              }
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </ContentCard>
              ))
          )}
        </div>
      </Wrapper>
    </>
  );
};
