import { useContext, useState } from 'react';
import Fade from 'react-reveal/Fade';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Link from 'next/link';

import {
  Wrapper,
  PrivateOptionQuestion,
  Footer,
  DecentralizedUsersItem
} from './styles';
import { Button } from 'components/Button';
import { Arrow, Krebit, Logo } from 'components/Icons';
import { NavBar } from 'components/NavBar';
import { ConnectWallet } from 'components/ConnectWallet';
import { useWindowSize } from 'hooks';
import { GeneralContext } from 'context';

const BOXES = [
  {
    box: 'KRB 180',
    username: 'fuano.eth',
    image: '/imgs/images/rare-buddies-1.png',
    skills: ['Illustrator', 'NFT Creator', 'UI']
  },
  {
    box: 'KRB 171',
    username: 'alerios.eth',
    image: '/imgs/images/alerios.jpg',
    skills: ['Developer', 'Product']
  },
  {
    box: 'KRB 152',
    username: 'texasfr.eth',
    image: '/imgs/images/texasfr.png',
    skills: ['Talent', 'Software', 'QA']
  },
  {
    box: 'KRB 150',
    username: 'andresmontoya.eth',
    image: '/imgs/images/andresmontoya.jpeg',
    skills: ['Javascript', 'UX', 'Frontend']
  },
  {
    box: 'KRB 143',
    username: 'piraseligman.eth',
    image: '/imgs/images/piraseligman.png',
    skills: ['Growth', 'Innovation', 'Design']
  }
];

export const Home = () => {
  const [isExtended, setExtended] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(0);
  const {
    walletModal: { handleOpenConnectWallet, openConnectWallet }
  } = useContext(GeneralContext);
  const windowSize = useWindowSize();
  const isHigher = windowSize.height >= 750;

  const handleExtended = (index: number | undefined) => {
    if (isExtended === undefined || isExtended !== index) {
      setExtended(index);
    }

    if (isExtended !== undefined && isExtended === index) {
      setExtended(undefined);
    }
  };

  const handleScrollToID = (id: string) => {
    document.getElementById(id).scrollIntoView();
  };

  const handleCurrentUser = (index: number = 0) => {
    setCurrentUser(index);
  };

  return (
    <>
      <ConnectWallet
        isOpen={openConnectWallet}
        onClose={handleOpenConnectWallet}
      />
      <NavBar />
      <Wrapper
        currentDecentralizedCardImage={BOXES[currentUser].image}
        isHigher={isHigher}
      >
        <div className="main">
          <div className="main-content">
            <h1 className="main-title">
              Professionals: Build and claim your Reputation Passport
            </h1>
            <ul>
              <li className="main-description">
                Get verified once, reuse it a billion times.
              </li>
              <li className="main-description">
                We help you build it, you own it.
              </li>
              <li className="main-description">
                Say goodbye to job applications and background checks.
              </li>
            </ul>
            <div className="main-buttons">
              <div className="main-button">
                <Button text="Try it now" onClick={handleOpenConnectWallet} />
              </div>
              <div className="main-line-button">
                <Link href="#web3">
                  <a className="main-line-button-text">Web3 Native</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="main-content-image"></div>
          <div
            className="main-content-explore"
            onClick={() => handleScrollToID('hire')}
          >
            <p className="main-content-explore-text">Explore more</p>
            <Arrow />
          </div>
        </div>
        <div id="hire" className="decentralized">
          <Fade bottom>
            <h2 className="decentralized-title">
              Recruiters: Instant Hiring is Here!
            </h2>
          </Fade>
          <Fade bottom>
            <div className="decentralized-users">
              <div className="decentralized-users-sort-menu">
                <input
                  className="decentralized-users-sort-menu-input"
                  placeholder="Search by credential"
                />
                <div className="decentralized-users-sort-menu-option-menu">
                  <p className="decentralized-users-sort-menu-option-menu-text">
                    Reputation
                  </p>
                  <Arrow />
                </div>
              </div>
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={BOXES[currentUser].username}
                  addEndListener={
                    ((node: HTMLElement, done: () => void) =>
                      node.addEventListener(
                        'transitionend',
                        done,
                        false
                      )) as any
                  }
                  classNames="fade"
                >
                  <div className="decentralized-users-card-container">
                    <Fade left>
                      <div className="decentralized-users-card">
                        <div className="decentralized-users-card-box">
                          <Krebit />
                          <p className="decentralized-users-card-box-title">
                            {BOXES[currentUser].box}
                          </p>
                        </div>
                        <div className="decentralized-users-card-image"></div>
                        <div className="decentralized-users-card-bottom">
                          <div className="decentralized-users-card-bottom-presentration">
                            <div className="decentralized-users-card-bottom-presentration-image"></div>
                            <p className="decentralized-users-card-bottom-presentration-title">
                              {BOXES[currentUser].username}
                            </p>
                          </div>
                          <div className="decentralized-users-card-bottom-skills">
                            {BOXES[currentUser].skills.map((skill, index) => (
                              <p
                                className="decentralized-users-card-bottom-skill"
                                key={index}
                              >
                                {skill}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Fade>
                  </div>
                </CSSTransition>
              </SwitchTransition>
              <div className="decentralized-users-list">
                {BOXES.map((user, index) => (
                  <DecentralizedUsersItem
                    key={index}
                    currentUserImage={user.image}
                    className={currentUser === index ? 'is-active' : ''}
                    onClick={() => handleCurrentUser(index)}
                  >
                    <div className="decentralized-users-item-content">
                      <div className="decentralized-users-item-content-image"></div>
                      <p className="decentralized-users-item-content-title">
                        {user.username}
                      </p>
                      <Krebit />
                    </div>
                    <p className="decentralized-users-item-content-id">
                      {user.box}
                    </p>
                  </DecentralizedUsersItem>
                ))}
              </div>
            </div>
          </Fade>
        </div>
        <Fade bottom>
          <div className="private">
            <div className="private-image private-image-first"></div>
            <div className="private-content">
              <h3 className="private-content-title">
                Smooth access to pre-vetted talent, certified by trusted issuers
              </h3>
              <PrivateOptionQuestion isExtended={isExtended === 0}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(0)}
                >
                  <p className="questions-option-title">
                    One click skill matching
                  </p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Contact pre-vetted candidates.
                </p>
              </PrivateOptionQuestion>
              <PrivateOptionQuestion isExtended={isExtended === 1}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(1)}
                >
                  <p className="questions-option-title">
                    Reach out to undiscovered gems
                  </p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Discover candidates you might be ignoring/missing.
                </p>
              </PrivateOptionQuestion>
              <PrivateOptionQuestion isExtended={isExtended === 2}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(2)}
                >
                  <p className="questions-option-title">
                    Get rid of bias in your hiring process
                  </p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Hire pseudonymous talent based on pre-vetted merit.
                </p>
              </PrivateOptionQuestion>
              <div className="private-button">
                <Button
                  text="Reserve your Recruiter Profile"
                  onClick={() => {
                    window.open('https://d3x2s82dzfa.typeform.com/to/B63Gz2v0');
                  }}
                />
              </div>
            </div>
          </div>
        </Fade>
        <Fade bottom>
          <div className="brands">
            <p className="brands-title">Powered by the best Web3 stack</p>
            <div className="brands-images">
              <div className="brands-images-1" />
              <div className="brands-images-2" />
              <div className="brands-images-3" />
              <div className="brands-images-4" />
              <div className="brands-images-5" />
            </div>
          </div>
        </Fade>
        <Fade bottom>
          <div id="web3" className="private private-different">
            <div className="private-image private-image-second"></div>
            <div className="private-content">
              <h3 className="private-content-title">
                Consolidate and own your Identity and Reputation
              </h3>
              <p className="private-content-description">
                Today you have to build your reputation on each platform every
                time. How can we unlock reputation from centralized platforms?
              </p>
              <p className="private-content-description">
                With Krebit you can apply to jobs with your Credentials, not
                filling endless forms.
              </p>
              <PrivateOptionQuestion isExtended={isExtended === 3}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(3)}
                >
                  <p className="questions-option-title">Portable</p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Give access to dApps that want to check your existing
                  reputation.
                </p>
              </PrivateOptionQuestion>
              <PrivateOptionQuestion isExtended={isExtended === 4}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(4)}
                >
                  <p className="questions-option-title">Privacy-Preserving</p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Show your talent to the world, without losing your private
                  life.
                </p>
              </PrivateOptionQuestion>
              <PrivateOptionQuestion isExtended={isExtended === 5}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(5)}
                >
                  <p className="questions-option-title">Decentralized</p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Krebit's protocol makes Web3 Identity more trustworthy with
                  community-verified credentials.
                </p>
              </PrivateOptionQuestion>
            </div>
          </div>
        </Fade>
      </Wrapper>
      <Footer>
        <div className="footer-image">
          <h2 className="footer-image-title">
            Share your Reputation, keep your Privacy
          </h2>
          <div className="footer-image-button">
            <Button
              text="Reserve your Reputation Passport"
              primaryColor="cyan"
              secondaryColor="blueRibbon"
              onClick={() => {
                window.open('https://d3x2s82dzfa.typeform.com/to/O9opkxQT');
              }}
            />
          </div>
        </div>
        <div className="footer-content">
          <div className="footer-content-left">
            <div className="footer-content-left-logo">
              <Logo />
            </div>
            <p className="footer-content-left-text">
              Your Reputation Passport for Better Job Matching.
              <br />© {new Date().getFullYear()} Krebit, All rights reserved.
            </p>
          </div>
          <div className="footer-content-right">
            <Link href="https://twitter.com/KrebitID" rel="noopener noreferrer">
              <a target="_blank" className="footer-content-right-option">
                Twitter
              </a>
            </Link>
            <Link
              href="https://www.publish0x.com/Krebit"
              rel="noopener noreferrer"
            >
              <a target="_blank" className="footer-content-right-option">
                Blog
              </a>
            </Link>
            <Link
              href="https://gitcoin.co/grants/3522/krebit-web3-verifiable-credentials"
              rel="noopener noreferrer"
            >
              <a target="_blank" className="footer-content-right-option">
                Gitcoin Grant
              </a>
            </Link>
          </div>
        </div>
      </Footer>
    </>
  );
};
