import React, {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { lib as passportLib } from '@krebitdao/reputation-passport/dist/lib';
import formatDistance from 'date-fns/formatDistance';
import { debounce } from 'ts-debounce';

import {
  CommentBox,
  CommentBoxCard,
  ContentBoxChatReplyTo,
  ContentCard,
  RightBoxItem,
  Wrapper
} from './styles';
import {
  Close,
  Favorite,
  Home,
  MoreVert,
  Reply,
  Comment,
  SentimentVerySatisfied,
  Tag,
  ThumbDown,
  Tune
} from 'components/Icons';
import { Loading } from 'components/Loading';
import { Button } from 'components/Button';
import { InlineDropdown } from 'components/InlineDropdown';
import { QuestionModal } from 'components/QuestionModal';
import { Input } from 'components/Input';
import { getDomains, substring } from './utils';
import { constants, orbisParseMarkdown, sortByDate } from 'utils';
import { DEFAULT_CHARACTER_LIMIT } from 'utils/orbisParseMarkdown';
import { DEFAULT_PICTURE } from 'utils/normalizeSchema';
import { GeneralContext } from 'context';
import { useWindowSize } from 'hooks';

export interface IGroupProps {
  channelId: string;
  postId?: string;
  group: any;
  members: any;
}

export interface IDropdownPostOpened {
  postId: string;
  type?: string;
}

export interface IPostActionOpened {
  id: string;
  type: string;
}

export interface IGroupForm {
  [key: string]: string;
}

interface IReplyTo {
  streamId: string;
  creator: any;
  replyToDetails: any;
  type: string;
  creatorDetails?: any;
}

const DEFAULT_LIST_PAGINATION = 50;
const DEFAULT_CURRENT_PAGE = 1;

export const Groups = (props: IGroupProps) => {
  const { channelId, postId, group, members } = props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState<IGroupForm>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [membersUpdated, setMembersUpdated] = useState(members);
  const [comment, setComment] = useState<any[]>();
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [dropdownPostOpened, setDropdownPostOpened] =
    useState<IDropdownPostOpened>();
  const [postActionOpened, setPostActionOpened] = useState<IPostActionOpened>();
  const [currentReplyTo, setCurrentReplyTo] = useState<IReplyTo>();
  const {
    auth,
    walletInformation: { orbis },
    walletModal: { handleOpenConnectWallet },
    profileInformation: { profile }
  } = useContext(GeneralContext);
  const { width } = useWindowSize();
  const { push } = useRouter();
  const isDesktop = width >= 1024;
  const isPostsLoading = status === 'idle' || status === 'pending_posts';
  const isMorePostsLoading = status === 'pending_more_posts';
  const isPostActionLoading = status === 'pending_post';

  useEffect(() => {
    if (isDesktop && !isFilterOpen) {
      setIsFilterOpen(true);
    }
  }, [isDesktop, isFilterOpen]);

  useEffect(() => {
    if (auth.status !== 'resolved') return;
    if (!members || members?.length === 0) return;

    const getDomainsFromMembers = async () => {
      const membersUpdated = await Promise.all(
        members.map(async member => {
          const { ensDomain, unsDomain } = await getDomains(
            member?.profile_details?.did
          );

          return {
            ...member,
            ensDomain,
            unsDomain
          };
        })
      );

      setMembersUpdated(membersUpdated);
    };

    getDomainsFromMembers();
  }, [members, auth.status]);

  useEffect(() => {
    if (!orbis) return;
    if (!postId) return;
    if (auth.status !== 'resolved') return;
    if (!isPostsLoading) return;

    handleCommentSelected(postId);
  }, [orbis, postId, auth.status, isPostsLoading]);

  const delayedPosts = useCallback(
    debounce((page = DEFAULT_CURRENT_PAGE) => getPosts(page), 500),
    [orbis, passportLib, auth.status, channelId, profile?.did, currentPage]
  );

  useEffect(() => {
    if (!orbis) return;
    if (!passportLib) return;
    if (auth.status !== 'resolved') return;

    delayedPosts(currentPage);

    return delayedPosts.cancel;
  }, [orbis, passportLib, auth.status, channelId, profile?.did, currentPage]);

  const getPosts = async (page = DEFAULT_CURRENT_PAGE) => {
    try {
      if (page > DEFAULT_CURRENT_PAGE) {
        setStatus('pending_more_posts');
      } else {
        setStatus('pending_posts');
      }

      const context =
        channelId === 'global_feed'
          ? null
          : channelId
          ? channelId
          : constants.DEFAULT_GROUP_ID;

      const { data, error } = await orbis.getPosts(
        {
          context,
          algorithm: channelId === 'global_feed' ? 'recommendations' : null
        },
        page - 1
      );

      if (error) {
        setStatus('rejected_posts');
        console.error('postsError', error);
        return;
      }

      let posts = await Promise.all(
        data.map(async post => {
          let reactions = [];

          if (profile?.did) {
            let { data } = await orbis.api
              .from('orbis_reactions')
              .select('type')
              .eq('post_id', post.stream_id)
              .eq('creator', profile.did);

            reactions = data;
          }

          const { ensDomain, unsDomain } = await getDomains(
            post?.creator_details?.did
          );

          return {
            ...post,
            ensDomain,
            unsDomain,
            reactions: reactions || []
          };
        })
      );

      if (page > DEFAULT_CURRENT_PAGE) {
        setPosts(prevValues => [...prevValues, ...posts]);
      } else {
        setPosts(posts);
      }

      setStatus('resolved_posts');
    } catch (error) {
      setStatus('rejected_posts');
      console.error(error);
    }
  };

  const handleFilterOpen = () => {
    if (isDesktop) return;

    setIsFilterOpen(prevState => !prevState);
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

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!profile?.did) {
      handleOpenConnectWallet();
      return;
    }

    if (!orbis) return;
    if (!group.stream_id) return;

    setStatus('pending_post');

    let type = 'feed';

    if (channelId && channelId !== 'global_feed') {
      type = group.channels.find(channel => channel.stream_id === channelId)
        ?.content?.type;
    }

    const postContent = {
      body: form?.comment,
      type: currentReplyTo || comment ? 'reply' : type,
      context: channelId,
      master: comment ? comment[0]?.stream_id : null,
      reply_to: currentReplyTo?.streamId
        ? currentReplyTo.streamId
        : comment
        ? comment[0]?.stream_id
        : null
    };

    const createPost = await orbis.createPost(postContent);

    if (!createPost?.doc) {
      setStatus('rejected_post');
      return;
    }

    const { ensDomain, unsDomain } = await getDomains(profile.did);

    let newPost = {
      creator: profile.did,
      creator_details: {
        did: profile.did,
        profile: profile?.orbisMetadata?.details?.profile
      },
      stream_id: createPost?.doc,
      content: postContent,
      count_replies: 0,
      count_likes: 0,
      count_haha: 0,
      count_downvotes: 0,
      reactions: [],
      ensDomain,
      unsDomain,
      master: comment ? comment[0]?.stream_id : null,
      type: currentReplyTo || comment ? 'reply' : type,
      reply_to: currentReplyTo?.streamId ? currentReplyTo.streamId : null,
      reply_to_details: currentReplyTo?.replyToDetails
        ? currentReplyTo.replyToDetails
        : null,
      reply_to_creator_details: currentReplyTo?.creator
        ? currentReplyTo.creator
        : null
    };

    if (currentReplyTo) {
      setCurrentReplyTo(undefined);
    }

    if (comment) {
      setComment(prevValues => [...prevValues, newPost]);
    }

    setPosts([newPost, ...posts]);
    handleCleanForm('comment', '');
    setStatus('resolved_post');
  };

  const handleReaction = async (
    postId: string,
    type: string,
    isComment = false
  ) => {
    if (!profile?.did) {
      handleOpenConnectWallet();
      return;
    }

    const indexPost = posts.findIndex(post => post.stream_id === postId);
    let indexComment: number;

    if (isComment) {
      indexComment = comment.findIndex(values => values.stream_id === postId);
    }

    if (indexPost === -1) {
      console.error('Post not found');
      return;
    }

    const updatedPost = posts[indexPost];
    let updatedComment: any;

    if (isComment) {
      updatedComment = comment[indexComment];
    }

    if (type === 'like') {
      if (!updatedPost.reactions.find(reaction => reaction.type === 'like')) {
        updatedPost.count_likes += 1;
        updatedPost.reactions.push({ type: 'like' });

        if (isComment) {
          updatedComment.count_likes += 1;
          updatedComment.reactions.push({ type: 'like' });
        }
      } else return;
    }

    if (type === 'haha') {
      if (!updatedPost.reactions.find(reaction => reaction.type === 'haha')) {
        updatedPost.count_haha += 1;
        updatedPost.reactions.push({ type: 'haha' });

        if (isComment) {
          updatedComment.count_haha += 1;
          updatedComment.reactions.push({ type: 'haha' });
        }
      } else return;
    }

    if (type === 'downvote') {
      if (
        !updatedPost.reactions.find(reaction => reaction.type === 'downvote')
      ) {
        updatedPost.count_downvotes += 1;
        updatedPost.reactions.push({ type: 'downvote' });

        if (isComment) {
          updatedComment.count_downvotes += 1;
          updatedComment.reactions.push({ type: 'downvote' });
        }
      } else return;
    }

    if (isComment) {
      setComment(prevValues => {
        let values = [...prevValues];
        values[indexComment] = updatedComment;

        return values;
      });
    }

    setPosts(prevValues => {
      let values = [...prevValues];
      values[indexPost] = updatedPost;

      return values;
    });

    const reaction = await orbis.react(postId, type);

    if (reaction.status === 300) {
      console.error('Error reacting to post');
      return;
    }
  };

  const handleCommentSelected = async (id: string | undefined) => {
    const getMetadata = async (id: string, did: string) => {
      let reactions = [];

      if (profile?.did) {
        let { data } = await orbis.api
          .from('orbis_reactions')
          .select('type')
          .eq('post_id', id)
          .eq('creator', profile.did);

        reactions = data;
      }

      const { ensDomain, unsDomain } = await getDomains(did);

      return {
        reactions,
        ensDomain,
        unsDomain
      };
    };

    if (!id) {
      setComment(undefined);
      setCurrentReplyTo(undefined);

      if (postId) {
        if (channelId) {
          push(`/posts/?channel_id=${channelId}`);
        } else {
          push('/posts');
        }
      }

      return;
    }

    try {
      setStatus('pending_comment');

      let { data: fetchedPost } = await orbis.getPost(id);

      const post = getMetadata(id, fetchedPost?.creator_details?.did).then(
        metadata => ({
          ...fetchedPost,
          ...metadata
        })
      );
      const replies = orbis
        .getPosts({
          master: id
        })
        .then(
          async ({ data: replies }) =>
            (await Promise.all(
              replies?.map(async reply => {
                let metadata = await getMetadata(
                  reply?.stream_id,
                  reply?.creator_details?.did
                );

                return {
                  ...reply,
                  ...metadata
                };
              })
            )) || []
        )
        .then(
          replies =>
            replies?.sort(reply =>
              sortByDate(reply?.timestamp, new Date(), 'des')
            ) || []
        );

      const [currentPost, currentReplies] = await Promise.all([post, replies]);

      const newComment = [currentPost, ...currentReplies];

      setComment(newComment);
      setStatus('resolved_comment');
    } catch (error) {
      console.error(error);
      setStatus('rejected_comment');
    }
  };

  const handleReplyTo = async (props: IReplyTo) => {
    if (!profile?.did) {
      handleOpenConnectWallet();
      return;
    }

    setCurrentReplyTo(props);
  };

  const handlePostActionOpened = (value: IPostActionOpened) => {
    if (!profile?.did) {
      handleOpenConnectWallet();
      return;
    }

    setPostActionOpened(value);
  };

  const handleActionPost = async () => {
    try {
      if (!profile?.did) {
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
        let indexComment: number;

        if (comment) {
          indexComment = comment.findIndex(
            values => values?.stream_id === postActionOpened?.id
          );
        }

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

        let updatedComment: any;

        if (comment) {
          updatedComment = {
            ...comment[indexComment],
            content: {
              ...comment[indexComment]?.content,
              body: form?.edit_post
            }
          };

          setComment(prevValues => {
            let values = [...prevValues];
            values[indexComment] = updatedComment;

            return values;
          });
        }

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

        if (comment) {
          setComment(undefined);
        }

        handlePostActionOpened(undefined);
        setStatus('resolved_post');
      }
    } catch (error) {
      console.error(error);
      setStatus('pending_error');
    }
  };

  const handleCurrentPage = () => {
    setCurrentPage(prevValue => prevValue + 1);
  };

  const handleDropdownPostOpened = (postId: string, type?: string) => {
    setDropdownPostOpened({ postId, type });
  };

  const handleOpenOrbis = (postId: string) => {
    if (!postId) return;

    window.open(`https://app.orbis.club/post/${postId}`, '_blank');
  };

  const handleApplyJob = (applyUrl: string) => {
    if (!applyUrl) return;

    window.open(applyUrl, '_blank');
  };

  const handleReferr = (jobId: string) => {
    if (!jobId) return;

    push(`/create/referral/?jobId=${jobId}`);
  };

  const handleCleanPage = () => {
    setCurrentPage(DEFAULT_CURRENT_PAGE);
    setForm(undefined);
    setComment(undefined);

    if (isFilterOpen) {
      handleFilterOpen();
    }
  };

  return (
    <>
      <style global jsx>{`
        html,
        body {
          overflow: hidden;
        }
      `}</style>
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
      <CommentBox
        hasCommentSelected={status === 'pending_comment' || Boolean(comment)}
        isReplyToOpen={currentReplyTo?.type === 'comment'}
      >
        <div className="comment-box">
          <div className="comment-box-header">
            <p className="comment-box-header-title"></p>
            <div
              className="comment-box-header-icon"
              onClick={() => handleCommentSelected(undefined)}
            >
              <Close />
            </div>
          </div>
          {status === 'pending_comment' ? (
            <div className="comment-box-loading">
              <Loading />
            </div>
          ) : (
            <div className="comment-box-cards">
              {comment?.map((values, index) => (
                <React.Fragment key={index}>
                  <CommentBoxCard
                    image={
                      values?.creator_details?.profile?.pfp || DEFAULT_PICTURE
                    }
                    isReply={index !== 0}
                  >
                    <div className="comment-box-image"></div>
                    <div className="comment-box-information">
                      <Link href={`/${values?.creator_details?.did}`}>
                        <a className="comment-box-information-title">
                          <span>
                            {substring(
                              values?.creator_details?.profile?.username
                            ) ||
                              substring(
                                values?.creator_details?.did,
                                100,
                                true
                              )}
                          </span>{' '}
                          {values?.timestamp ? (
                            <span className="timestamp">
                              {formatDistance(
                                values?.timestamp * 1000,
                                new Date(),
                                { addSuffix: true }
                              )}
                            </span>
                          ) : (
                            <span className="timestamp">Now</span>
                          )}
                          {values?.ensDomain || values?.unsDomain ? (
                            <div className="comment-box-information-title-boxes">
                              {values?.ensDomain && (
                                <span>{values?.ensDomain}</span>
                              )}
                              {values?.unsDomain && (
                                <span>{values?.unsDomain}</span>
                              )}
                            </div>
                          ) : null}
                        </a>
                      </Link>
                      <p className="comment-box-information-description">
                        {values?.content?.data?.type === 'job' ? (
                          <div>
                            <img src={values?.content?.data?.imageUrl} />
                            <h2>{values?.content?.data?.title}</h2>
                            <h3>{values?.content?.data?.entity}</h3>
                            <ul>
                              {Object.entries({
                                industries: values?.content?.data?.industries,
                                size: values?.content?.data?.industries,
                                roles: values?.content?.data?.roles,
                                skills: values?.content?.data?.skills
                              }).map(([key, value]) => (
                                <li>
                                  <strong>{key}:</strong> {value}
                                </li>
                              ))}
                            </ul>
                            <p>{values?.content?.data?.description}</p>
                          </div>
                        ) : (
                          orbisParseMarkdown(values?.content, false)
                        )}
                      </p>

                      {values?.content?.data?.type === 'job' && (
                        <div className="comment-box-information-actions">
                          <div className="comment-box-information-action">
                            <div className="comment-box-information-action-option">
                              <button
                                className="comment-box-input-button"
                                onClick={() =>
                                  handleApplyJob(
                                    values?.content?.data?.applyUrl
                                  )
                                }
                                disabled={
                                  isPostsLoading ||
                                  isMorePostsLoading ||
                                  isPostActionLoading ||
                                  status === 'pending_comment'
                                }
                              >
                                Apply to this Job
                              </button>
                            </div>
                            <div className="comment-box-information-action-option">
                              <button
                                className="comment-box-input-button"
                                onClick={() => handleReferr(values?.stream_id)}
                                disabled={
                                  isPostsLoading ||
                                  isMorePostsLoading ||
                                  isPostActionLoading ||
                                  status === 'pending_comment'
                                }
                              >
                                Referr a Friend
                              </button>
                              <br />
                              <br />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="comment-box-information-actions">
                        <div className="comment-box-information-action">
                          <div
                            className="comment-box-information-action-option"
                            onClick={() =>
                              handleReplyTo({
                                streamId: values?.stream_id,
                                creator: values?.creator_details,
                                replyToDetails: values?.content,
                                type: 'comment',
                                creatorDetails: values?.creator_details
                              })
                            }
                          >
                            <Reply />
                            <span>{values?.count_replies || 0}</span>
                          </div>
                          <div
                            className={`comment-box-information-action-option ${
                              values?.reactions?.some(
                                reaction => reaction.type === 'like'
                              )
                                ? 'active'
                                : ''
                            }`}
                            onClick={() =>
                              handleReaction(values?.stream_id, 'like', true)
                            }
                          >
                            <Favorite />
                            <span>{values?.count_likes || 0}</span>
                          </div>
                          <div
                            className={`comment-box-information-action-option ${
                              values?.reactions?.some(
                                reaction => reaction.type === 'haha'
                              )
                                ? 'active'
                                : ''
                            }`}
                            onClick={() =>
                              handleReaction(values?.stream_id, 'haha', true)
                            }
                          >
                            <SentimentVerySatisfied />
                            <span>{values?.count_haha || 0}</span>
                          </div>
                          <div
                            className={`comment-box-information-action-option ${
                              values?.reactions?.some(
                                reaction => reaction.type === 'downvote'
                              )
                                ? 'active'
                                : ''
                            }`}
                            onClick={() =>
                              handleReaction(
                                values?.stream_id,
                                'downvote',
                                true
                              )
                            }
                          >
                            <ThumbDown />
                            <span>{values?.count_downvotes || 0}</span>
                          </div>
                        </div>
                        <div className="comment-box-information-action">
                          {values?.creator_details?.did === profile?.did && (
                            <div
                              className="comment-box-information-action-option"
                              onClick={() =>
                                handleDropdownPostOpened(
                                  values?.stream_id,
                                  'comment'
                                )
                              }
                            >
                              <MoreVert />
                            </div>
                          )}
                          <div
                            className="comment-box-information-action-option"
                            onClick={() =>
                              handleOpenOrbis(
                                values?.type === 'reply'
                                  ? values?.master
                                  : values?.stream_id
                              )
                            }
                          >
                            <img src="/imgs/logos/orbis.png" />
                          </div>
                        </div>
                        {dropdownPostOpened?.postId === values?.stream_id &&
                        dropdownPostOpened?.type === 'comment' ? (
                          <div className="comment-box-information-options-dropdown">
                            <InlineDropdown
                              items={[
                                {
                                  title: 'Edit post',
                                  onClick: () =>
                                    handlePostActionOpened({
                                      id: values?.stream_id,
                                      type: 'edit'
                                    })
                                },
                                {
                                  title: 'Delete post',
                                  onClick: () =>
                                    handlePostActionOpened({
                                      id: values?.stream_id,
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
                  </CommentBoxCard>
                  {index === 0 && <hr />}
                </React.Fragment>
              ))}
            </div>
          )}
          <div className="comment-box-input-container">
            {currentReplyTo?.type === 'comment' && (
              <ContentBoxChatReplyTo
                replyToImage={
                  currentReplyTo?.creatorDetails?.profile?.pfp ||
                  DEFAULT_PICTURE
                }
              >
                <div className="content-box-chat-reply-to-info">
                  <p className="content-box-chat-reply-to-text">
                    Replying to:{' '}
                  </p>
                  <div className="content-box-chat-reply-to-image"></div>
                  <p className="content-box-chat-reply-to-title">
                    {substring(
                      currentReplyTo?.creatorDetails?.profile?.username,
                      20
                    ) ||
                      substring(currentReplyTo?.creatorDetails?.did, 20, true)}
                  </p>
                </div>
                <div
                  className="content-box-chat-reply-to-close"
                  onClick={() => handleReplyTo(undefined)}
                >
                  <Close />
                </div>
              </ContentBoxChatReplyTo>
            )}
            <div className="comment-box-input">
              <textarea
                className="comment-box-input-element"
                placeholder="share your post here"
                value={form?.comment}
                disabled={
                  isPostsLoading ||
                  isMorePostsLoading ||
                  isPostActionLoading ||
                  status === 'pending_comment'
                }
                name="comment"
                onChange={handleChange}
              />
              <button
                className="comment-box-input-button"
                onClick={handleSubmit}
                disabled={
                  isPostsLoading ||
                  isMorePostsLoading ||
                  isPostActionLoading ||
                  status === 'pending_comment'
                }
              >
                post
              </button>
            </div>
          </div>
        </div>
      </CommentBox>
      <Wrapper image={group?.content?.pfp} isFilterOpen={isFilterOpen}>
        <div className="left-box-background">
          <div className="left-box">
            <div className="left-box-header">
              <p className="left-box-text"></p>
              <div className="left-box-header-icon" onClick={handleFilterOpen}>
                <Close />
              </div>
            </div>

            <p className="left-box-title">Krebiters</p>
            <p className="left-box-description">
              Community of professionals earning in crypto/web3 💼💸 🆔💙own
              your #reputation, earn with your #talent, keep your #privacy
            </p>
            <div className="left-box-list">
              <Link href="/posts/?channel_id=global_feed">
                <a
                  className={`left-box-list-option ${
                    channelId === 'global_feed' ? 'active' : ''
                  }`}
                  onClick={() => handleCleanPage()}
                >
                  <div className="left-box-list-option-icon">
                    <Home />
                  </div>
                  <p className="left-box-list-option-text">Home</p>
                </a>
              </Link>
              <Link href="/posts">
                <a
                  className={`left-box-list-option ${
                    !channelId ? 'active' : ''
                  }`}
                  onClick={() => handleCleanPage()}
                >
                  <div className="left-box-list-option-icon">
                    <Tag />
                  </div>
                  <p className="left-box-list-option-text">Krebiters</p>
                </a>
              </Link>
              {group?.channels?.map((channel, index) => (
                <Link
                  href={`/posts/?channel_id=${channel?.stream_id}`}
                  key={index}
                >
                  <a
                    className={`left-box-list-option ${
                      channelId === channel?.stream_id ? 'active' : ''
                    }`}
                    onClick={() => handleCleanPage()}
                  >
                    <div className="left-box-list-option-icon">
                      {channel?.content?.type === 'chat' ? (
                        <Comment />
                      ) : (
                        <Tag />
                      )}
                    </div>
                    <p className="left-box-list-option-text">
                      {channel?.content?.name}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {group?.currentView === 'chat' ? (
          <div className="content-chat">
            <div
              className={`content-box-list ${
                currentReplyTo?.type === 'chat' ? 'content-box-list-bigger' : ''
              }`}
            >
              {isPostsLoading ? (
                <div className="content-loading-card">
                  <Loading />
                </div>
              ) : (
                posts.length > 0 &&
                posts.map((post, index) => (
                  <ContentCard
                    image={
                      post?.creator_details?.profile?.pfp || DEFAULT_PICTURE
                    }
                    replyToImage={
                      post?.reply_to_creator_details?.profile?.pfp ||
                      DEFAULT_PICTURE
                    }
                    type="chat"
                    key={index}
                  >
                    {post?.reply_to_details && (
                      <div className="content-card-reply-to">
                        <div className="content-card-reply-to-icon"></div>
                        <div
                          className="content-card-reply-to-main"
                          onClick={() =>
                            handleCommentSelected(
                              post?.type === 'reply'
                                ? post?.master
                                : post?.stream_id
                            )
                          }
                        >
                          <div className="content-card-reply-to-main-image"></div>
                          <div className="content-card-reply-to-main-texts">
                            <p className="content-card-reply-to-main-texts-title">
                              {substring(
                                post?.reply_to_creator_details?.profile
                                  ?.username,
                                20
                              ) ||
                                substring(
                                  post?.reply_to_creator_details?.did,
                                  20,
                                  true
                                )}{' '}
                              <span>
                                {post?.reply_to_details?.body?.length > 70
                                  ? `${substring(
                                      post?.reply_to_details?.body,
                                      70
                                    )}...`
                                  : post?.reply_to_details?.body}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="content-card-main">
                      <div className="content-card-image"></div>
                      <div className="content-card-information">
                        <div className="content-card-information-header">
                          <Link href={`/${post?.creator_details?.did}`}>
                            <a className="content-card-information-title">
                              <span>
                                {substring(
                                  post?.creator_details?.profile?.username
                                ) ||
                                  substring(
                                    post?.creator_details?.did,
                                    100,
                                    true
                                  )}{' '}
                                {post?.timestamp ? (
                                  <span className="timestamp">
                                    {formatDistance(
                                      post?.timestamp * 1000,
                                      new Date(),
                                      { addSuffix: true }
                                    )}
                                  </span>
                                ) : (
                                  <span className="timestamp">Now</span>
                                )}
                              </span>
                              {post?.ensDomain || post?.unsDomain ? (
                                <div className="content-card-information-title-boxes">
                                  {post?.ensDomain && (
                                    <span>{post?.ensDomain}</span>
                                  )}
                                  {post?.unsDomain && (
                                    <span>{post?.unsDomain}</span>
                                  )}
                                </div>
                              ) : null}
                            </a>
                          </Link>
                          <div className="content-card-information-options">
                            <div
                              className="content-card-information-option"
                              onClick={() =>
                                handleReplyTo({
                                  streamId: post?.stream_id,
                                  creator: post?.creator_details,
                                  replyToDetails: post?.content,
                                  type: 'chat',
                                  creatorDetails: post?.creator_details
                                })
                              }
                            >
                              <Reply />
                            </div>
                            {post?.creator_details?.did === profile?.did && (
                              <div
                                className="content-card-information-option revert"
                                onClick={() =>
                                  handleDropdownPostOpened(post?.stream_id)
                                }
                              >
                                <MoreVert />
                              </div>
                            )}
                            <div
                              className="content-card-information-option"
                              onClick={() =>
                                handleOpenOrbis(
                                  post?.type === 'reply'
                                    ? post?.master
                                    : post?.stream_id
                                )
                              }
                            >
                              <img src="/imgs/logos/orbis.png" />
                            </div>
                          </div>
                          {dropdownPostOpened?.postId === post?.stream_id &&
                          !dropdownPostOpened?.type ? (
                            <div className="content-card-information-options-dropdown">
                              <InlineDropdown
                                items={[
                                  {
                                    title: 'Edit post',
                                    onClick: () =>
                                      handlePostActionOpened({
                                        id: post?.stream_id,
                                        type: 'edit'
                                      })
                                  },
                                  {
                                    title: 'Delete post',
                                    onClick: () =>
                                      handlePostActionOpened({
                                        id: post?.stream_id,
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
                        <p className="content-card-information-description">
                          {orbisParseMarkdown(post?.content)}{' '}
                          {post?.content?.body?.length >
                          DEFAULT_CHARACTER_LIMIT ? (
                            <span
                              className="view-more"
                              onClick={() =>
                                handleCommentSelected(
                                  post?.type === 'reply'
                                    ? post?.master
                                    : post?.stream_id
                                )
                              }
                            >
                              View more
                            </span>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </ContentCard>
                ))
              )}
              {isMorePostsLoading ? (
                <div className="content-loading-card">
                  <Loading />
                </div>
              ) : null}
              {!isPostsLoading &&
                posts?.length >= DEFAULT_LIST_PAGINATION * currentPage && (
                  <div className="content-loadmore-button">
                    <Button
                      text="View more"
                      onClick={handleCurrentPage}
                      styleType="border"
                      borderBackgroundColor="ebony"
                      isDisabled={isMorePostsLoading}
                    />
                  </div>
                )}
            </div>
            <div className="content-box-chat">
              {currentReplyTo?.type === 'chat' && (
                <ContentBoxChatReplyTo
                  replyToImage={
                    currentReplyTo?.creatorDetails?.profile?.pfp ||
                    DEFAULT_PICTURE
                  }
                >
                  <div className="content-box-chat-reply-to-info">
                    <p className="content-box-chat-reply-to-text">
                      Replying to:{' '}
                    </p>
                    <div className="content-box-chat-reply-to-image"></div>
                    <p className="content-box-chat-reply-to-title">
                      {substring(
                        currentReplyTo?.creatorDetails?.profile?.username,
                        20
                      ) ||
                        substring(
                          currentReplyTo?.creatorDetails?.did,
                          20,
                          true
                        )}
                    </p>
                  </div>
                  <div
                    className="content-box-chat-reply-to-close"
                    onClick={() => handleReplyTo(undefined)}
                  >
                    <Close />
                  </div>
                </ContentBoxChatReplyTo>
              )}
              <div className="content-box-input">
                <textarea
                  className="content-box-input-element"
                  placeholder="share your post here"
                  disabled={
                    isPostsLoading || isMorePostsLoading || isPostActionLoading
                  }
                  name="comment"
                  value={form?.comment}
                  onChange={handleChange}
                />
                <button
                  className="content-box-input-button"
                  onClick={handleSubmit}
                  disabled={
                    isPostsLoading || isMorePostsLoading || isPostActionLoading
                  }
                >
                  post
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="content">
            <div className="content-header">
              <p className="content-header-title">Send your post</p>
              <div className="content-header-icon" onClick={handleFilterOpen}>
                <Tune />
              </div>
            </div>
            <div className="content-box-input">
              <textarea
                className="content-box-input-element"
                placeholder="share your post here"
                disabled={
                  isPostsLoading || isMorePostsLoading || isPostActionLoading
                }
                name="comment"
                value={form?.comment}
                onChange={handleChange}
                rows={4}
              />
              <button
                className="content-box-input-button"
                onClick={handleSubmit}
                disabled={
                  isPostsLoading || isMorePostsLoading || isPostActionLoading
                }
              >
                post
              </button>
            </div>
            <div className="content-box-list">
              {isPostsLoading ? (
                <div className="content-loading-card">
                  <Loading />
                </div>
              ) : (
                posts.length > 0 &&
                posts.map((post, index) => (
                  <ContentCard
                    image={
                      post?.creator_details?.profile?.pfp || DEFAULT_PICTURE
                    }
                    replyToImage={
                      post?.reply_to_creator_details?.profile?.pfp ||
                      DEFAULT_PICTURE
                    }
                    key={index}
                  >
                    {post?.reply_to_details && (
                      <div className="content-card-reply-to">
                        <div className="content-card-reply-to-icon"></div>
                        <div
                          className="content-card-reply-to-main"
                          onClick={() =>
                            handleCommentSelected(
                              post?.type === 'reply'
                                ? post?.master
                                : post?.stream_id
                            )
                          }
                        >
                          <div className="content-card-reply-to-main-image"></div>
                          <div className="content-card-reply-to-main-texts">
                            <p className="content-card-reply-to-main-texts-title">
                              {substring(
                                post?.reply_to_creator_details?.profile
                                  ?.username,
                                20
                              ) ||
                                substring(
                                  post?.reply_to_creator_details?.did,
                                  20,
                                  true
                                )}{' '}
                              <span>
                                {post?.reply_to_details?.body?.length > 70
                                  ? `${substring(
                                      post?.reply_to_details?.body,
                                      70
                                    )}...`
                                  : post?.reply_to_details?.body}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="content-card-main">
                      <div className="content-card-image"></div>
                      <div className="content-card-information">
                        <Link href={`/${post?.creator_details?.did}`}>
                          <a className="content-card-information-title">
                            <span>
                              {substring(
                                post?.creator_details?.profile?.username
                              ) ||
                                substring(
                                  post?.creator_details?.did,
                                  100,
                                  true
                                )}{' '}
                              {post?.timestamp ? (
                                <span className="timestamp">
                                  {formatDistance(
                                    post?.timestamp * 1000,
                                    new Date(),
                                    { addSuffix: true }
                                  )}
                                </span>
                              ) : (
                                <span className="timestamp">Now</span>
                              )}
                            </span>
                            {post?.ensDomain || post?.unsDomain ? (
                              <div className="content-card-information-title-boxes">
                                {post?.ensDomain && (
                                  <span>{post?.ensDomain}</span>
                                )}
                                {post?.unsDomain && (
                                  <span>{post?.unsDomain}</span>
                                )}
                              </div>
                            ) : null}
                          </a>
                        </Link>
                        <p className="content-card-information-description">
                          {orbisParseMarkdown(post?.content)}{' '}
                          {post?.content?.body?.length >
                          DEFAULT_CHARACTER_LIMIT ? (
                            <span
                              className="view-more"
                              onClick={() =>
                                handleCommentSelected(
                                  post?.type === 'reply'
                                    ? post?.master
                                    : post?.stream_id
                                )
                              }
                            >
                              View more
                            </span>
                          ) : null}
                        </p>
                        <div className="content-card-information-actions">
                          <div className="content-card-information-action">
                            <div
                              className={`content-card-information-action-option`}
                              onClick={() =>
                                handleCommentSelected(
                                  post?.type === 'reply'
                                    ? post?.master
                                    : post?.stream_id
                                )
                              }
                            >
                              <Comment />
                              <span>{post?.count_replies || 0}</span>
                            </div>
                            <div
                              className={`content-card-information-action-option ${
                                post?.reactions?.some(
                                  reaction => reaction.type === 'like'
                                )
                                  ? 'active'
                                  : ''
                              }`}
                              onClick={() =>
                                handleReaction(post?.stream_id, 'like')
                              }
                            >
                              <Favorite />
                              <span>{post?.count_likes || 0}</span>
                            </div>
                            <div
                              className={`content-card-information-action-option ${
                                post?.reactions?.some(
                                  reaction => reaction.type === 'haha'
                                )
                                  ? 'active'
                                  : ''
                              }`}
                              onClick={() =>
                                handleReaction(post?.stream_id, 'haha')
                              }
                            >
                              <SentimentVerySatisfied />
                              <span>{post?.count_haha || 0}</span>
                            </div>
                            <div
                              className={`content-card-information-action-option ${
                                post?.reactions?.some(
                                  reaction => reaction.type === 'downvote'
                                )
                                  ? 'active'
                                  : ''
                              }`}
                              onClick={() =>
                                handleReaction(post?.stream_id, 'downvote')
                              }
                            >
                              <ThumbDown />
                              <span>{post?.count_downvotes || 0}</span>
                            </div>
                          </div>
                          <div className="content-card-information-action">
                            {post?.creator_details?.did === profile?.did && (
                              <div
                                className="content-card-information-action-option"
                                onClick={() =>
                                  handleDropdownPostOpened(post?.stream_id)
                                }
                              >
                                <MoreVert />
                              </div>
                            )}
                            <div
                              className="content-card-information-action-option"
                              onClick={() =>
                                handleOpenOrbis(
                                  post?.type === 'reply'
                                    ? post?.master
                                    : post?.stream_id
                                )
                              }
                            >
                              <img src="/imgs/logos/orbis.png" />
                            </div>
                          </div>
                          {dropdownPostOpened?.postId === post?.stream_id &&
                          !dropdownPostOpened?.type ? (
                            <div className="content-card-information-action-dropdown">
                              <InlineDropdown
                                items={[
                                  {
                                    title: 'Edit post',
                                    onClick: () =>
                                      handlePostActionOpened({
                                        id: post?.stream_id,
                                        type: 'edit'
                                      })
                                  },
                                  {
                                    title: 'Delete post',
                                    onClick: () =>
                                      handlePostActionOpened({
                                        id: post?.stream_id,
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
              {isMorePostsLoading ? (
                <div className="content-loading-card">
                  <Loading />
                </div>
              ) : null}
              {!isPostsLoading &&
                posts?.length >= DEFAULT_LIST_PAGINATION * currentPage && (
                  <div className="content-loadmore-button">
                    <Button
                      text="View more"
                      onClick={handleCurrentPage}
                      styleType="border"
                      borderBackgroundColor="ebony"
                      isDisabled={isMorePostsLoading}
                    />
                  </div>
                )}
            </div>
          </div>
        )}
        <div className="right-box">
          <p className="right-box-text">MEMBERS</p>
          <div className="right-box-list">
            {membersUpdated?.map((member, index) => (
              <Link href={`/${member?.profile_details?.did}`} key={index}>
                <RightBoxItem
                  image={
                    member?.profile_details?.profile?.pfp || DEFAULT_PICTURE
                  }
                >
                  <div className="right-box-item-image"></div>
                  <div className="right-box-item-content">
                    <p className="right-box-item-content-title">
                      {substring(member?.profile_details?.profile?.username) ||
                        substring(member?.profile_details?.did, 30, true)}
                    </p>
                    {member?.ensDomain || member?.unsDomain ? (
                      <div className="right-box-item-content-boxes">
                        {member?.ensDomain && (
                          <span>{substring(member?.ensDomain)}</span>
                        )}
                        {member?.unsDomain && (
                          <span>{substring(member?.unsDomain)}</span>
                        )}
                      </div>
                    ) : null}
                  </div>
                </RightBoxItem>
              </Link>
            ))}
          </div>
        </div>
      </Wrapper>
    </>
  );
};
