import { useState } from 'react';
import Fade from 'react-reveal/Fade';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import {
  Wrapper,
  PrivateOptionQuestion,
  Footer,
  DecentralizedUsersItem,
} from './styles';
import { Button } from 'components/Button';
import { Arrow, Krebit, Logo, Play } from 'components/Icons';

const BOXES = [
  {
    box: 'KRB 140',
    username: 'Andres Montoya',
    image: '/imgs/images/home.png',
    skills: ['JavaScript', 'Software', 'Ethereum'],
  },
  {
    box: 'KRB 141',
    username: 'Alejandro',
    image: '/imgs/logos/Logo.svg',
    skills: ['Engnieering', 'Lead', 'Krebit'],
  },
  {
    box: 'KRB 142',
    username: 'Oliver',
    image: '/imgs/images/home.png',
    skills: ['Design', 'Software', 'UX'],
  },
  {
    box: 'KRB 143',
    username: 'Juan',
    image: '/imgs/images/home.png',
    skills: ['Math', 'Teach', 'School'],
  },
  {
    box: 'KRB 144',
    username: 'Andrea',
    image: '/imgs/images/home.png',
    skills: ['Marketing', 'Software', 'Design'],
  },
];

export const Home = () => {
  const [isExtended, setExtended] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(0);

  const handleExtended = (index: number | undefined) => {
    if (isExtended === undefined || isExtended !== index) {
      setExtended(index);
    }

    if (isExtended !== undefined && isExtended === index) {
      setExtended(undefined);
    }
  };

  const handleCurrentUser = (index: number = 0) => {
    setCurrentUser(index);
  };

  return (
    <>
      <Wrapper currentDecentralizedCardImage={BOXES[currentUser].image}>
        <div className="main">
          <div className="main-content">
            <h1 className="main-title">
              Connecting the best Talent through portable Reputation
            </h1>
            <p className="main-description">
              Own a professional profile that recruiters can trust with
              verifiable-credentials.
            </p>
            <div className="main-buttons">
              <div className="main-button">
                <Button
                  text="Connect wallet"
                  primaryColor="rose"
                  secondaryColor="blueRibbon"
                  onClick={() => {}}
                />
              </div>
              <div className="main-line-button">
                <Play />
                <p className="main-line-button-text">Watch video</p>
              </div>
            </div>
          </div>
          <div className="main-content-image"></div>
        </div>
        <div className="decentralized">
          <Fade bottom>
            <h2 className="decentralized-title">
              Your professional Reputation verified once, reused everywhere
            </h2>
          </Fade>
          <Fade bottom>
            <div className="decentralized-users">
              <div className="decentralized-users-sort-menu">
                <p className="decentralized-users-sort-menu-title">
                  Top Krebit profiles
                </p>
                <div className="decentralized-users-sort-menu-option">
                  <p className="decentralized-users-sort-menu-option-title">
                    Sort by
                  </p>
                  <Arrow />
                </div>
              </div>
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={BOXES[currentUser].username}
                  addEndListener={(node, done) =>
                    node.addEventListener('transitionend', done, false)
                  }
                  classNames="fade"
                >
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
            <div className="private-image"></div>
            <div className="private-content">
              <p className="private-content-title">
                Consolidate and own your professional Reputation
              </p>
              <p className="private-content-description">
                Today you have to build your reputation on each platform every
                time. How can we unlock reputation from centralized platforms?
                With Krebit you can apply to jobs with your Credentials, not
                filling endless forms.
              </p>
              <PrivateOptionQuestion isExtended={isExtended === 0}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(0)}
                >
                  <p className="questions-option-title">Portable</p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Give access to dApps that want to check your existing
                  reputation
                </p>
              </PrivateOptionQuestion>
              <PrivateOptionQuestion isExtended={isExtended === 1}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(1)}
                >
                  <p className="questions-option-title">Privacy-Preserving</p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Show your talent to the world, without loosing your private
                  life.
                </p>
              </PrivateOptionQuestion>
              <PrivateOptionQuestion isExtended={isExtended === 2}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(2)}
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
        <Fade bottom>
          <div className="private private-different">
            <div className="private-image"></div>
            <div className="private-content">
              <p className="private-content-title">
                Identify and recruit the best Talent
              </p>
              <p className="private-content-description">
                Recruitment is a complex, time consuming and often a frustrating
                process if not managed properly. Krebit is best decentralized
                platform to Verify the Reputation of Talent in Web3.
              </p>
              <PrivateOptionQuestion isExtended={isExtended === 3}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(3)}
                >
                  <p className="questions-option-title">Effective</p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Discover candidates you might be ignoring/missing. Hire
                  pseudonymous talent based on pre-vetted merit.
                </p>
              </PrivateOptionQuestion>
              <PrivateOptionQuestion isExtended={isExtended === 4}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(4)}
                >
                  <p className="questions-option-title">Time-Saving</p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Contact pre-vetted candidates.
                </p>
              </PrivateOptionQuestion>
              <PrivateOptionQuestion isExtended={isExtended === 5}>
                <div
                  className="questions-option-header"
                  onClick={() => handleExtended(5)}
                >
                  <p className="questions-option-title">Composable</p>
                  <Arrow />
                </div>
                <p className="questions-option-description">
                  Itegrate with ATS systems: "Apply to this Job with Krebit"
                </p>
              </PrivateOptionQuestion>
            </div>
          </div>
        </Fade>
        <Fade bottom>
          <div className="brands">
            <p className="brands-title">Trusted by the best</p>
            <div className="brands-images">
              <div className="brands-images-1" />
              <div className="brands-images-2" />
              <div className="brands-images-3" />
              <div className="brands-images-4" />
              <div className="brands-images-5" />
            </div>
          </div>
        </Fade>
      </Wrapper>
      <Footer>
        <div className="footer-image">
          <h2 className="footer-image-title">
            Share your Talent, keep your Privacy
          </h2>
          <div className="footer-image-button">
            <Button
              text="Connect wallet"
              primaryColor="cyan"
              secondaryColor="blueRibbon"
              onClick={() => {}}
            />
          </div>
        </div>
        <div className="footer-content">
          <div className="footer-content-left">
            <div className="footer-content-left-logo">
              <Logo />
            </div>
            <p className="footer-content-left-text">
              © {new Date().getFullYear()} Krebit, All right reserved.
            </p>
          </div>
          <div className="footer-content-right">
            <a className="footer-content-right-option">Blog</a>
            <a className="footer-content-right-option">Docs</a>
            <a className="footer-content-right-option">DAO</a>
          </div>
        </div>
      </Footer>
    </>
  );
};
