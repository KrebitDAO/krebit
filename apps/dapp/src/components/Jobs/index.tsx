import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import Link from 'next/link';
import { lib as passportLib } from '@krebitdao/reputation-passport/dist/lib';
import formatDistance from 'date-fns/formatDistance';

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
  Send,
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
import { DEFAULT_PICTURE } from 'utils/normalizeSchema';
import { getDomains, substring } from './utils';
import { GeneralContext } from 'context';
import { useWindowSize } from 'hooks';
import { debounce } from 'ts-debounce';
import { orbisParseMarkdown } from 'utils';

export interface IJobProps {
  jobId: string;
  group: any;
  members: any;
}

interface IPostActionOpened {
  id: string;
  type: string;
}

interface IForm {
  [key: string]: string;
}

interface IReplyToChat {
  streamId: string;
  creator: any;
  replyToDetails: any;
  creatorDetails?: any;
}

const GROUP_ID =
  'kjzl6cwe1jw14ai2gg8e0qmx2j944ppe3s3dgfk003jlb8guuybyg4m77nsrg73';
const DEFAULT_LIST_PAGINATION = 50;
const DEFAULT_CURRENT_PAGE = 1;

export const Jobs = (props: IJobProps) => {
  const { jobId, group, members } = props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState<IForm>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [membersUpdated, setMembersUpdated] = useState(members);
  const [comment, setComment] = useState<any>();
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const [dropdownPostOpened, setDropdownPostOpened] = useState<string>();
  const [postActionOpened, setPostActionOpened] = useState<IPostActionOpened>();
  const [currentReplyToChat, setCurrentReplyToChat] = useState<IReplyToChat>();
  const parentDropdownRef = useRef();
  const {
    auth,
    walletInformation: { orbis },
    walletModal: { handleOpenConnectWallet },
    profileInformation: { profile }
  } = useContext(GeneralContext);
  const { width } = useWindowSize();
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
  }, [members]);

  const delayedPosts = useCallback(
    debounce((page = DEFAULT_CURRENT_PAGE) => getPosts(page), 500),
    [orbis, passportLib, auth.status, jobId, profile?.did, currentPage]
  );

  useEffect(() => {
    if (!orbis) return;
    if (!passportLib) return;
    if (auth.status !== 'resolved') return;

    delayedPosts(currentPage);

    return delayedPosts.cancel;
  }, [orbis, passportLib, auth.status, jobId, profile?.did, currentPage]);

  const getPosts = async (page = DEFAULT_CURRENT_PAGE) => {
    try {
      if (page > DEFAULT_CURRENT_PAGE) {
        setStatus('pending_more_posts');
      } else {
        setStatus('pending_posts');
      }

      const { data, error } = await orbis.getPosts(
        {
          context: jobId ? jobId : GROUP_ID
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

    if (jobId) {
      type = group.channels.find(channel => channel.stream_id === jobId)
        ?.content?.type;
    }

    const postContent = {
      body: form?.comment,
      type,
      context: jobId,
      reply_to: currentReplyToChat?.streamId
        ? currentReplyToChat.streamId
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
      reply_to: currentReplyToChat?.streamId
        ? currentReplyToChat.streamId
        : null,
      reply_to_details: currentReplyToChat?.replyToDetails
        ? currentReplyToChat.replyToDetails
        : null,
      reply_to_creator_details: currentReplyToChat?.creator
        ? currentReplyToChat.creator
        : null
    };

    if (currentReplyToChat) {
      setCurrentReplyToChat(undefined);
    }

    setPosts([newPost, ...posts]);
    handleCleanForm('comment', '');
    setStatus('resolved_post');
  };

  const handleReaction = async (postId: string, type: string) => {
    if (!profile?.did) {
      handleOpenConnectWallet();
      return;
    }

    const indexPost = posts.findIndex(post => post.stream_id === postId);

    if (indexPost === -1) {
      console.error('Post not found');
      return;
    }

    const updatedPost = posts[indexPost];

    if (type === 'like') {
      updatedPost.count_likes += 1;

      if (!updatedPost.reactions.find(reaction => reaction.type === 'like')) {
        updatedPost.reactions.push({ type: 'like' });
      }
    }

    if (type === 'haha') {
      updatedPost.count_haha += 1;

      if (!updatedPost.reactions.find(reaction => reaction.type === 'haha')) {
        updatedPost.reactions.push({ type: 'haha' });
      }
    }

    if (type === 'downvote') {
      updatedPost.count_downvotes += 1;

      if (
        !updatedPost.reactions.find(reaction => reaction.type === 'downvote')
      ) {
        updatedPost.reactions.push({ type: 'downvote' });
      }
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

  const handleCommentSelected = async (
    id: string | undefined,
    type = 'comment'
  ) => {
    if (!profile?.did) {
      handleOpenConnectWallet();
      return;
    }

    const getMetadata = async (postId: string, did: string) => {
      let { data: reactions } = await orbis.api
        .from('orbis_reactions')
        .select('type')
        .eq('post_id', postId)
        .eq('creator', profile.did);

      const { ensDomain, unsDomain } = await getDomains(did);

      return {
        reactions,
        ensDomain,
        unsDomain
      };
    };

    if (!id) {
      setStatus('rejected_comment');
      return;
    }

    try {
      setStatus('pending_comment');

      let { data: fetchedPost } = await orbis.getPost(id);

      if (fetchedPost.type === 'feed') {
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
          .then(replies => {
            replies.every((reply, index) => {
              console.log(reply?.stream_id, replies[index]?.reply_to);
              return reply;
            });
            return replies;
          });

        const [currentPost, currentReplies] = await Promise.all([
          post,
          replies
        ]);

        console.log(currentReplies);

        setComment({
          ...currentPost,
          replies: currentReplies
        });
      }

      if (fetchedPost.type === 'reply') {
      }

      setStatus('resolved_comment');
    } catch (error) {
      console.error(error);
      setStatus('rejected_comment');
    }
  };

  const handleReplyToChat = async (props: IReplyToChat) => {
    if (!profile?.did) {
      handleOpenConnectWallet();
      return;
    }

    setCurrentReplyToChat(props);
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

  const handleCurrentPage = () => {
    setCurrentPage(prevValue => prevValue + 1);
  };

  const handleDropdownPostOpened = (postId: string) => {
    setDropdownPostOpened(postId);
  };

  const handleOpenOrbis = (postId: string) => {
    if (!postId) return;

    window.open(`https://app.orbis.club/post/${postId}`, '_blank');
  };

  const handleCleanPage = () => {
    setCurrentPage(DEFAULT_CURRENT_PAGE);
    setForm(undefined);
    setComment(undefined);
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
        hasCommentSelected={
          status === 'pending_comment' || status === 'resolved_comment'
        }
      >
        <div className="comment-box">
          <div className="comment-box-header">
            <p className="comment-box-header-title">Replies</p>
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
              <CommentBoxCard
                image={
                  comment?.creator_details?.profile?.pfp || DEFAULT_PICTURE
                }
              >
                <div className="comment-box-image"></div>
                <div className="comment-box-information">
                  <Link href={`/${comment?.creator_details?.did}`}>
                    <a className="comment-box-information-title">
                      <span>
                        {substring(
                          comment?.creator_details?.profile?.username
                        ) ||
                          substring(comment?.creator_details?.did, 100, true)}
                      </span>
                      {comment?.ensDomain || comment?.unsDomain ? (
                        <div className="comment-box-information-title-boxes">
                          {comment?.ensDomain && (
                            <span>{comment?.ensDomain}</span>
                          )}
                          {comment?.unsDomain && (
                            <span>{comment?.unsDomain}</span>
                          )}
                        </div>
                      ) : null}
                    </a>
                  </Link>
                  <p className="comment-box-information-description">
                    {comment?.content?.body}
                  </p>
                  <div className="comment-box-information-actions">
                    <div className="comment-box-information-action">
                      <div
                        className="comment-box-information-action-option"
                        onClick={() => handleCommentSelected('123', 'reply')}
                      >
                        <Reply />
                        <span>{comment?.count_replies || 0}</span>
                      </div>
                      <div
                        className={`comment-box-information-action-option ${
                          comment?.reactions?.some(
                            reaction => reaction.type === 'like'
                          )
                            ? 'active'
                            : ''
                        }`}
                        onClick={() =>
                          handleReaction(comment?.stream_id, 'like')
                        }
                      >
                        <Favorite />
                        <span>{comment?.count_likes || 0}</span>
                      </div>
                      <div
                        className={`comment-box-information-action-option ${
                          comment?.reactions?.some(
                            reaction => reaction.type === 'haha'
                          )
                            ? 'active'
                            : ''
                        }`}
                        onClick={() =>
                          handleReaction(comment?.stream_id, 'haha')
                        }
                      >
                        <SentimentVerySatisfied />
                        <span>{comment?.count_haha || 0}</span>
                      </div>
                      <div
                        className={`comment-box-information-action-option ${
                          comment?.reactions?.some(
                            reaction => reaction.type === 'downvote'
                          )
                            ? 'active'
                            : ''
                        }`}
                        onClick={() =>
                          handleReaction(comment?.stream_id, 'downvote')
                        }
                      >
                        <ThumbDown />
                        <span>{comment?.count_downvotes || 0}</span>
                      </div>
                    </div>
                    <div className="comment-box-information-action">
                      <div className="comment-box-information-action-option">
                        <span>0</span>
                      </div>
                      <div className="comment-box-information-action-option">
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CommentBoxCard>
              <hr />
              {comment?.replies?.map((reply, index) => (
                <CommentBoxCard
                  key={index}
                  image={
                    reply?.creator_details?.profile?.pfp || DEFAULT_PICTURE
                  }
                  isReply={true}
                >
                  <div className="comment-box-image"></div>
                  <div className="comment-box-information">
                    <Link href={`/${comment?.creator_details?.did}`}>
                      <a className="comment-box-information-title">
                        <span>
                          {substring(
                            reply?.creator_details?.profile?.username
                          ) ||
                            substring(reply?.creator_details?.did, 100, true)}
                        </span>
                        {reply?.ensDomain || reply?.unsDomain ? (
                          <div className="comment-box-information-title-boxes">
                            {reply?.ensDomain && (
                              <span>{reply?.ensDomain}</span>
                            )}
                            {reply?.unsDomain && (
                              <span>{reply?.unsDomain}</span>
                            )}
                          </div>
                        ) : null}
                      </a>
                    </Link>
                    <p className="comment-box-information-description">
                      {reply?.content?.body}
                    </p>
                    <div className="comment-box-information-actions">
                      <div className="comment-box-information-action">
                        <div
                          className="comment-box-information-action-option"
                          onClick={() => handleCommentSelected('123', 'reply')}
                        >
                          <Reply />
                          <span>{reply?.count_replies || 0}</span>
                        </div>
                        <div
                          className={`comment-box-information-action-option ${
                            reply?.reactions?.some(
                              reaction => reaction.type === 'like'
                            )
                              ? 'active'
                              : ''
                          }`}
                          onClick={() =>
                            handleReaction(reply?.stream_id, 'like')
                          }
                        >
                          <Favorite />
                          <span>{reply?.count_likes || 0}</span>
                        </div>
                        <div
                          className={`comment-box-information-action-option ${
                            reply?.reactions?.some(
                              reaction => reaction.type === 'haha'
                            )
                              ? 'active'
                              : ''
                          }`}
                          onClick={() =>
                            handleReaction(reply?.stream_id, 'haha')
                          }
                        >
                          <SentimentVerySatisfied />
                          <span>{reply?.count_haha || 0}</span>
                        </div>
                        <div
                          className={`comment-box-information-action-option ${
                            reply?.reactions?.some(
                              reaction => reaction.type === 'downvote'
                            )
                              ? 'active'
                              : ''
                          }`}
                          onClick={() =>
                            handleReaction(reply?.stream_id, 'downvote')
                          }
                        >
                          <ThumbDown />
                          <span>{reply?.count_downvotes || 0}</span>
                        </div>
                      </div>
                      <div className="comment-box-information-action">
                        <div className="comment-box-information-action-option">
                          <Home />
                          <span>0</span>
                        </div>
                        <div className="comment-box-information-action-option">
                          <Home />
                          <span>0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CommentBoxCard>
              ))}
            </div>
          )}
          <div className="comment-box-input-container">
            <div className="comment-box-input">
              <textarea
                className="comment-box-input-element"
                placeholder="share your job here"
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
                save
              </button>
            </div>
          </div>
        </div>
      </CommentBox>
      <Wrapper image={group?.content?.pfp} isFilterOpen={isFilterOpen}>
        <div className="left-box-background">
          <div className="left-box">
            <div className="left-box-header">
              <p className="left-box-text">GROUP DETAILS</p>
              <div className="left-box-header-icon" onClick={handleFilterOpen}>
                <Close />
              </div>
            </div>
            <div className="left-box-image"></div>
            <p className="left-box-title">{group?.content?.name}</p>
            <p className="left-box-description">
              {group?.content?.description}
            </p>
            <div className="left-box-list">
              <Link href="/jobs">
                <a
                  className={`left-box-list-option ${!jobId ? 'active' : ''}`}
                  onClick={() => handleCleanPage()}
                >
                  <div className="left-box-list-option-icon">
                    <Home />
                  </div>
                  <p className="left-box-list-option-text">Home</p>
                </a>
              </Link>
              {group?.channels?.map((channel, index) => (
                <Link href={`/jobs/?job_id=${channel?.stream_id}`} key={index}>
                  <a
                    className={`left-box-list-option ${
                      jobId === channel?.stream_id ? 'active' : ''
                    }`}
                    onClick={() => handleCleanPage()}
                  >
                    <div className="left-box-list-option-icon">
                      {channel?.content?.type === 'chat' ? <Send /> : <Tag />}
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
                currentReplyToChat ? 'content-box-list-bigger' : ''
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
                          onClick={() => handleCommentSelected(post.reply_to)}
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
                                {post?.timestamp && (
                                  <span className="timestamp">
                                    {formatDistance(
                                      post?.timestamp * 1000,
                                      new Date(),
                                      { addSuffix: true }
                                    )}
                                  </span>
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
                                handleReplyToChat({
                                  streamId: post?.stream_id,
                                  creator: post?.creator_details,
                                  replyToDetails: post?.content,
                                  creatorDetails: post?.creator_details
                                })
                              }
                            >
                              <Reply />
                            </div>
                            {post?.creator_details?.did === profile?.did && (
                              <div
                                ref={parentDropdownRef}
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
                              onClick={() => handleOpenOrbis(post?.stream_id)}
                            >
                              <img src="/imgs/logos/orbis.png" />
                            </div>
                          </div>
                          {dropdownPostOpened === post?.stream_id && (
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
                                parentRef={parentDropdownRef}
                                onClose={() =>
                                  handleDropdownPostOpened(undefined)
                                }
                              />
                            </div>
                          )}
                        </div>
                        <p className="content-card-information-description">
                          {orbisParseMarkdown(post?.content)}
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
              {currentReplyToChat && (
                <ContentBoxChatReplyTo
                  replyToImage={
                    currentReplyToChat?.creatorDetails?.profile?.pfp ||
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
                        currentReplyToChat?.creatorDetails?.profile?.username,
                        20
                      ) ||
                        substring(
                          currentReplyToChat?.creatorDetails?.did,
                          20,
                          true
                        )}
                    </p>
                  </div>
                  <div
                    className="content-box-chat-reply-to-close"
                    onClick={() => handleReplyToChat(undefined)}
                  >
                    <Close />
                  </div>
                </ContentBoxChatReplyTo>
              )}
              <div className="content-box-input">
                <textarea
                  className="content-box-input-element"
                  placeholder="share your job here"
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
                  save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="content">
            <div className="content-header">
              <p className="content-header-title">Send your job</p>
              <div className="content-header-icon" onClick={handleFilterOpen}>
                <Tune />
              </div>
            </div>
            <div className="content-box-input">
              <textarea
                className="content-box-input-element"
                placeholder="share your job here"
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
                save
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
                          onClick={() => handleCommentSelected(post.reply_to)}
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
                              {post?.timestamp && (
                                <span className="timestamp">
                                  {formatDistance(
                                    post?.timestamp * 1000,
                                    new Date(),
                                    { addSuffix: true }
                                  )}
                                </span>
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
                          {orbisParseMarkdown(post?.content)}
                        </p>
                        <div className="content-card-information-actions">
                          <div className="content-card-information-action">
                            <div
                              className={`content-card-information-action-option`}
                              onClick={() =>
                                handleCommentSelected(post?.stream_id)
                              }
                            >
                              <Send />
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
                                ref={parentDropdownRef}
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
                              onClick={() => handleOpenOrbis(post?.stream_id)}
                            >
                              <img src="/imgs/logos/orbis.png" />
                            </div>
                          </div>
                          {dropdownPostOpened === post?.stream_id && (
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
                                parentRef={parentDropdownRef}
                                onClose={() =>
                                  handleDropdownPostOpened(undefined)
                                }
                              />
                            </div>
                          )}
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
