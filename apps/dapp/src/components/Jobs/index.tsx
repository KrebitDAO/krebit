import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState
} from 'react';

import { ContentCard, RightBoxItem, Wrapper } from './styles';
import { Close, Explore, Tune } from 'components/Icons';
import { Loading } from 'components/Loading';
import { GeneralContext } from 'context';
import { useWindowSize } from 'hooks';

interface IPostProps {
  username: string;
  domains: string[];
  image: string;
  description: string;
  actions: {
    comment: number;
    heart: number;
    haha: number;
    down: number;
  };
}

export const Jobs = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [post, setPost] = useState<string>();
  const [posts, setPosts] = useState<IPostProps[]>([]);
  const {
    walletInformation: { orbis }
  } = useContext(GeneralContext);
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const isLoading = status === 'pending';

  useEffect(() => {
    if (isDesktop && !isFilterOpen) {
      setIsFilterOpen(true);
    }
  }, [isDesktop, isFilterOpen]);

  useEffect(() => {
    if (!orbis) return;

    setStatus('pending');
    try {
      setPosts([
        {
          username: 'andresmontoya',
          domains: ['andresmontoya.eth', 'andresmontoya.krebit'],
          image: '/imgs/images/andresmontoya.jpeg',
          description: 'hola a todos!',
          actions: {
            comment: 1,
            heart: 1,
            haha: 1,
            down: 1
          }
        }
      ]);
      setStatus('resolved');
    } catch (error) {
      setStatus('rejected');
      console.error(error);
    }
  }, [orbis]);

  const handleFilterOpen = () => {
    if (isDesktop) return;

    setIsFilterOpen(prevState => !prevState);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const { value } = event.target;

    setPost(value);
  };

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const values = {
      username: 'andresmontoya',
      domains: ['andresmontoya.eth', 'andresmontoya.krebit'],
      image: '/imgs/images/andresmontoya.jpeg',
      description: post,
      actions: {
        comment: 1,
        heart: 1,
        haha: 1,
        down: 1
      }
    };

    setPosts([values, ...posts]);
  };

  return (
    <>
      <style global jsx>{`
        html,
        body {
          overflow: hidden;
        }
      `}</style>
      <Wrapper
        image="/imgs/images/andresmontoya.jpeg"
        isFilterOpen={isFilterOpen}
      >
        {isLoading ? (
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
              <p className="left-box-title">Krebit Jobs</p>
              <p className="left-box-description">krebit is bla bla bla</p>
              <div className="left-box-list">
                <div className="left-box-list-option active">
                  <div className="left-box-list-option-icon">
                    <Explore />
                  </div>
                  <p className="left-box-list-option-text">Home</p>
                </div>
                <div className="left-box-list-option">
                  <div className="left-box-list-option-icon">
                    <Explore />
                  </div>
                  <p className="left-box-list-option-text">Home</p>
                </div>
                <div className="left-box-list-option">
                  <div className="left-box-list-option-icon">
                    <Explore />
                  </div>
                  <p className="left-box-list-option-text">Home</p>
                </div>
                <div className="left-box-list-option">
                  <div className="left-box-list-option-icon">
                    <Explore />
                  </div>
                  <p className="left-box-list-option-text">Home</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="content">
          {isLoading ? (
            new Array(3).fill(0).map((_, index) => (
              <div className="content-loading-card" key={index}>
                <Loading type="skeleton" />
              </div>
            ))
          ) : (
            <>
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
                  value={post}
                  onChange={handleChange}
                  rows={4}
                />
                <button
                  className="content-box-input-button"
                  onClick={handleSubmit}
                >
                  save
                </button>
              </div>
              <div className="content-box-list">
                {posts.map((post, index) => (
                  <ContentCard image={post.image} key={index}>
                    <div className="content-card-image"></div>
                    <div className="content-card-information">
                      <div className="content-card-information-title">
                        <span>{post.username}</span>
                        <div className="content-card-information-title-boxes">
                          {post.domains.map((domain, index) => (
                            <span key={index}>{domain}</span>
                          ))}
                        </div>
                      </div>
                      <p className="content-card-information-description">
                        {post.description}
                      </p>
                      <div className="content-card-information-actions">
                        <div className="content-card-information-action">
                          <div className="content-card-information-action-option">
                            <Explore />
                            <span>{post.actions.comment}</span>
                          </div>
                          <div className="content-card-information-action-option">
                            <Explore />
                            <span>{post.actions.heart}</span>
                          </div>
                          <div className="content-card-information-action-option">
                            <Explore />
                            <span>{post.actions.haha}</span>
                          </div>
                          <div className="content-card-information-action-option">
                            <Explore />
                            <span>{post.actions.down}</span>
                          </div>
                        </div>
                        <div className="content-card-information-action">
                          <div className="content-card-information-action-option">
                            <Explore />
                            <span>0</span>
                          </div>
                          <div className="content-card-information-action-option">
                            <Explore />
                            <span>0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ContentCard>
                ))}
              </div>
            </>
          )}
        </div>
        {isLoading ? (
          <div className="right-box-loading">
            <Loading type="skeleton" />
          </div>
        ) : (
          <div>
            <div className="right-box">
              <p className="right-box-text">MEMBERS</p>
              <div className="right-box-list">
                <RightBoxItem image="/imgs/images/andresmontoya.jpeg">
                  <div className="right-box-item-image"></div>
                  <div className="right-box-item-content">
                    <p className="right-box-item-content-title">
                      andresmontoya
                    </p>
                    <p className="right-box-item-content-box">
                      andresmontoya.eth
                    </p>
                  </div>
                </RightBoxItem>
                <RightBoxItem image="/imgs/images/andresmontoya.jpeg">
                  <div className="right-box-item-image"></div>
                  <div className="right-box-item-content">
                    <p className="right-box-item-content-title">
                      andresmontoya
                    </p>
                    <p className="right-box-item-content-box">
                      andresmontoya.eth
                    </p>
                  </div>
                </RightBoxItem>
              </div>
            </div>
          </div>
        )}
      </Wrapper>
    </>
  );
};
