import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState
} from 'react';
import Link from 'next/link';
import { getAddressFromDid } from '@orbisclub/orbis-sdk/utils';
import { lib as passportLib } from '@krebitdao/reputation-passport/dist/lib';

import {
  CommentBox,
  CommentBoxCard,
  ContentCard,
  RightBoxItem,
  Wrapper
} from './styles';
import {
  Close,
  Favorite,
  Home,
  Reply,
  Send,
  SentimentVerySatisfied,
  Tag,
  ThumbDown,
  Tune
} from 'components/Icons';
import { Loading } from 'components/Loading';
import { DEFAULT_PICTURE } from 'utils/normalizeSchema';
import { GeneralContext } from 'context';
import { useWindowSize } from 'hooks';
import { Button } from 'components/Button';

export interface IJobProps {
  jobId: string;
}

const GROUP_ID =
  'kjzl6cwe1jw14ai2gg8e0qmx2j944ppe3s3dgfk003jlb8guuybyg4m77nsrg73';
const DEFAULT_LIST_PAGINATION = 50;
const DEFAULT_CURRENT_PAGE = 1;

const substring = (value: string, length = 30, isAddress = false) => {
  if (isAddress) {
    return getAddressFromDid(value)?.address?.substring(0, length);
  }

  return value?.substring(0, length);
};

export const Jobs = (props: IJobProps) => {
  const { jobId } = props;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [groupInformation, setGroupInformation] = useState<any>();
  const [membersData, setMembersData] = useState<any>();
  const [post, setPost] = useState<string>();
  const [posts, setPosts] = useState<any[]>([]);
  const [comment, setComment] = useState<any>();
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);
  const {
    auth,
    walletInformation: { orbis },
    profileInformation: { profile }
  } = useContext(GeneralContext);
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const isGroupLoading = status === 'idle' || status === 'pending_group';
  const isPostsLoading = status === 'idle' || status === 'pending_posts';
  const isPostActionLoading = status === 'pending_post';

  useEffect(() => {
    if (isDesktop && !isFilterOpen) {
      setIsFilterOpen(true);
    }
  }, [isDesktop, isFilterOpen]);

  useEffect(() => {
    if (!orbis) return;
    if (auth.status !== 'resolved') return;

    const getGroup = async () => {
      try {
        setStatus('pending_group');
        const { data: groupData, error: groupError } = await orbis.getGroup(
          GROUP_ID
        );
        const { data: membersData, error: membersError } =
          await orbis.getGroupMembers(GROUP_ID);

        const membersDataUpdated = await Promise.all(
          membersData.map(async member => {
            let unsDomain = null;
            let ensDomain = null;

            if (!member?.profile_details?.did.match('did:pkh:solana')) {
              let address = getAddressFromDid(
                member?.profile_details?.did
              )?.address;
              ensDomain = await passportLib.ens.lookupAddress(address);
              unsDomain = await passportLib.uns.lookupAddress(address);

              return {
                ...member,
                unsDomain,
                ensDomain
              };
            }
          })
        );

        if (groupError || membersError) {
          setStatus('rejected_group');
          console.error('groupError', groupError);
          console.error('membersError', membersError);
          return;
        }

        setGroupInformation(groupData);
        setMembersData(membersDataUpdated);
        setStatus('resolved_group');
      } catch (error) {
        setStatus('rejected_group');
        console.error(error);
      }
    };

    getGroup();
  }, [orbis, auth.status]);

  useEffect(() => {
    if (!orbis) return;
    if (!passportLib) return;
    if (isGroupLoading) return;
    if (auth.status !== 'resolved') return;

    getPosts();
  }, [
    orbis,
    passportLib,
    auth.status,
    jobId,
    profile?.did,
    isGroupLoading,
    currentPage
  ]);

  const getPosts = async () => {
    try {
      setStatus('pending_posts');

      const { data, error } = await orbis.getPosts(
        {
          context: jobId || GROUP_ID
        },
        currentPage - 1
      );

      if (error) {
        setStatus('rejected_posts');
        console.error('postsError', error);
        return;
      }

      let posts = await Promise.all(
        data.map(async post => {
          let { data } = await orbis.api
            .from('orbis_reactions')
            .select('type')
            .eq('post_id', post.stream_id)
            .eq('creator', profile.did);

          let ensDomain = null;
          let unsDomain = null;

          if (!post?.creator_details?.did.match('did:pkh:solana')) {
            let address = getAddressFromDid(
              post?.creator_details?.did
            )?.address;

            if (address) {
              ensDomain = await passportLib.ens.lookupAddress(address);
              unsDomain = await passportLib.uns.lookupAddress(address);
            }
          }

          return {
            ...post,
            ensDomain,
            unsDomain,
            reactions: data || []
          };
        })
      );

      if (currentPage > DEFAULT_CURRENT_PAGE) {
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

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event?.preventDefault();
    const { value } = event.target;

    setPost(value);
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!orbis) return;
    if (!groupInformation.stream_id) return;

    setStatus('pending_post');

    let type = 'feed';

    if (jobId) {
      type = groupInformation.channels.find(
        channel => channel.stream_id === jobId
      )?.content?.type;
    }

    const postContent = {
      body: post,
      type,
      context: jobId
    };

    const createPost = await orbis.createPost(postContent);

    if (!createPost?.doc) {
      setStatus('rejected_post');
      return;
    }

    let address = getAddressFromDid(profile.did)?.address;
    let ensDomain = await passportLib.ens.lookupAddress(address);
    let unsDomain = await passportLib.uns.lookupAddress(address);

    const newPost = {
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
      unsDomain
      /* reply_to: reply_to ? reply_to.stream_id : null,
      reply_to_details: reply_to ? reply_to.reply_to_details : null,
      reply_to_creator_details: reply_to ? reply_to.creator : null, */
    };

    setPosts([newPost, ...posts]);
    setPost('');
    setStatus('resolved_post');
  };

  const handleReaction = async (postId: string, type: string) => {
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
    if (!id) {
      setComment(undefined);
      return;
    }

    let currentPost = await orbis.getPost(id);

    let { data: reactions } = await orbis.api
      .from('orbis_reactions')
      .select('type')
      .eq('post_id', id)
      .eq('creator', profile.did);

    let ensDomain = null;
    let unsDomain = null;

    if (!currentPost?.creator_details?.did.match('did:pkh:solana')) {
      let address = getAddressFromDid(
        currentPost?.creator_details?.did
      )?.address;

      if (address) {
        ensDomain = await passportLib.ens.lookupAddress(address);
        unsDomain = await passportLib.uns.lookupAddress(address);
      }
    }

    currentPost = {
      ...currentPost,
      ensDomain,
      unsDomain,
      reactions: reactions || []
    };

    setComment(currentPost);
  };

  const handleCurrentPage = (page = DEFAULT_CURRENT_PAGE) => {
    if (page === DEFAULT_CURRENT_PAGE) {
      setPosts([]);
    }

    setCurrentPage(page);
  };

  return (
    <>
      <style global jsx>{`
        html,
        body {
          overflow: hidden;
        }
      `}</style>
      <CommentBox hasCommentSelected={!!comment}>
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
          <div className="comment-box-cards">
            <CommentBoxCard image={comment?.image}>
              <div className="comment-box-image"></div>
              <div className="comment-box-information">
                <div className="comment-box-information-title">
                  <span>{comment?.username}</span>
                  <div className="comment-box-information-title-boxes">
                    {comment?.domains.map((domain, index) => (
                      <span key={index}>{domain}</span>
                    ))}
                  </div>
                </div>
                <p className="comment-box-information-description">
                  {comment?.description}
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
                      onClick={() => handleReaction(comment?.stream_id, 'like')}
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
                      onClick={() => handleReaction(comment?.stream_id, 'haha')}
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
            {comment?.replies.map((reply, index) => (
              <CommentBoxCard key={index} image={reply.image} isReply={true}>
                <div className="comment-box-image"></div>
                <div className="comment-box-information">
                  <div className="comment-box-information-title">
                    <span>{reply.username}</span>
                    <div className="comment-box-information-title-boxes">
                      {reply.domains.map((domain, index) => (
                        <span key={index}>{domain}</span>
                      ))}
                    </div>
                  </div>
                  <p className="comment-box-information-description">
                    {reply.description}
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
                        onClick={() => handleReaction(reply?.stream_id, 'like')}
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
                        onClick={() => handleReaction(reply?.stream_id, 'haha')}
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
          <div className="comment-box-input-container">
            <div className="comment-box-input">
              <textarea
                className="comment-box-input-element"
                placeholder="share your job here"
                value={post}
                disabled={
                  isGroupLoading || isPostsLoading || isPostActionLoading
                }
                onChange={handleChange}
              />
              <button
                className="comment-box-input-button"
                onClick={handleSubmit}
                disabled={
                  isGroupLoading || isPostsLoading || isPostActionLoading
                }
              >
                save
              </button>
            </div>
          </div>
        </div>
      </CommentBox>
      <Wrapper
        image={groupInformation?.content?.pfp}
        isFilterOpen={isFilterOpen}
      >
        {isGroupLoading ? (
          <div className="left-box-loading">
            <Loading type="skeleton" />
          </div>
        ) : (
          <div className="left-box-background">
            <div className="left-box">
              <div className="left-box-header">
                <p className="left-box-text">GROUP DETAILS</p>
                <div
                  className="left-box-header-icon"
                  onClick={handleFilterOpen}
                >
                  <Close />
                </div>
              </div>
              <div className="left-box-image"></div>
              <p className="left-box-title">
                {groupInformation?.content?.name}
              </p>
              <p className="left-box-description">
                {groupInformation?.content?.description}
              </p>
              <div className="left-box-list">
                <Link href="/jobs">
                  <div
                    className={`left-box-list-option ${!jobId ? 'active' : ''}`}
                    onClick={() => handleCurrentPage()}
                  >
                    <div className="left-box-list-option-icon">
                      <Home />
                    </div>
                    <p className="left-box-list-option-text">Home</p>
                  </div>
                </Link>
                {groupInformation?.channels?.map((channel, index) => (
                  <Link
                    href={`/jobs/?job_id=${channel?.stream_id}`}
                    key={index}
                  >
                    <div
                      className={`left-box-list-option ${
                        jobId === channel?.stream_id ? 'active' : ''
                      }`}
                      onClick={() => handleCurrentPage()}
                    >
                      <div className="left-box-list-option-icon">
                        {channel?.content?.type === 'chat' ? <Send /> : <Tag />}
                      </div>
                      <p className="left-box-list-option-text">
                        {channel?.content?.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
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
              disabled={isGroupLoading || isPostsLoading || isPostActionLoading}
              value={post}
              onChange={handleChange}
              rows={4}
            />
            <button
              className="content-box-input-button"
              onClick={handleSubmit}
              disabled={isGroupLoading || isPostsLoading || isPostActionLoading}
            >
              save
            </button>
          </div>
          <div className="content-box-list">
            {posts.length > 0 &&
              posts.map((post, index) => (
                <ContentCard
                  image={post?.creator_details?.profile?.pfp || DEFAULT_PICTURE}
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
                              post?.reply_to_creator_details?.profile?.username,
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
                        <div className="content-card-information-title">
                          <span>
                            {substring(
                              post?.creator_details?.profile?.username
                            ) ||
                              substring(post?.creator_details?.did, 100, true)}
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
                        </div>
                      </Link>
                      <p className="content-card-information-description">
                        {post?.content?.body}
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
                          <div className="content-card-information-action-option">
                            <Home />
                            <span>0</span>
                          </div>
                          <div className="content-card-information-action-option">
                            <Home />
                            <span>0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ContentCard>
              ))}
            {isPostsLoading || isGroupLoading ? (
              <div className="content-loading-card">
                <Loading />
              </div>
            ) : null}
            {posts?.length >= DEFAULT_LIST_PAGINATION * currentPage && (
              <div className="content-loadmore-button">
                <Button
                  text="View more"
                  onClick={() => handleCurrentPage(currentPage + 1)}
                  styleType="border"
                  borderBackgroundColor="ebony"
                  isDisabled={isPostsLoading || isGroupLoading}
                />
              </div>
            )}
          </div>
        </div>
        {isGroupLoading ? (
          <div className="right-box-loading">
            <Loading type="skeleton" />
          </div>
        ) : (
          <div>
            <div className="right-box">
              <p className="right-box-text">MEMBERS</p>
              <div className="right-box-list">
                {membersData.map((member, index) => (
                  <Link href={`/${member?.profile_details?.did}`} key={index}>
                    <RightBoxItem
                      image={
                        member?.profile_details?.profile?.pfp || DEFAULT_PICTURE
                      }
                    >
                      <div className="right-box-item-image"></div>
                      <div className="right-box-item-content">
                        <p className="right-box-item-content-title">
                          {substring(
                            member?.profile_details?.profile?.username
                          ) ||
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
          </div>
        )}
      </Wrapper>
    </>
  );
};
