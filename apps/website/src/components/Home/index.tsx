import { useState } from 'react';

import { Wrapper, PrivateOptionQuestion } from './styles';
import { Button } from 'components/Button';
import { Arrow, Krebit, Play } from 'components/Icons';

export const Home = () => {
  const [isExtended, setExtended] = useState(undefined);

  const handleExtended = index => {
    if (isExtended === undefined || isExtended !== index) {
      setExtended(index);
    }

    if (isExtended !== undefined && isExtended === index) {
      setExtended(undefined);
    }
  };

  return (
    <Wrapper>
      <div className="main">
        <div className="main-content">
          <h1 className="main-title">
            Decentralization to drive your career forward.
          </h1>
          <p className="main-description">
            Krebit.id is an open identity verification protocol, DAO and
            marketplace for Web3 Verifiable Credentials.
          </p>
          <div className="main-buttons">
            <div className="main-button">
              <Button
                text="Connect wallet"
                primaryColor="rose"
                secondaryColor="blueRibbon"
                backgroundColor="#029afe"
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
        <h2 className="decentralized-title">
          Decentralized Identity to enable users control their profiles and
          data-stores.
        </h2>
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
          <div className="decentralized-users-card">
            <div className="decentralized-users-card-box">
              <Krebit />
              <p className="decentralized-users-card-box-title">rkRB 140</p>
            </div>
            <div className="decentralized-users-card-image"></div>
            <div className="decentralized-users-card-bottom">
              <div className="decentralized-users-card-bottom-presentration">
                <div className="decentralized-users-card-bottom-presentration-image"></div>
                <p className="decentralized-users-card-bottom-presentration-title">
                  Theoliver333
                </p>
              </div>
              <div className="decentralized-users-card-bottom-title">
                Product Designer
              </div>
            </div>
          </div>
          <div className="decentralized-users-list">
            {new Array(4).fill(0).map((_, index) => (
              <div
                className={`decentralized-users-item ${
                  index === 0 ? 'is-active' : ''
                }`}
              >
                <div className="decentralized-users-item-content">
                  <div className="decentralized-users-item-content-image"></div>
                  <p className="decentralized-users-item-content-title">
                    Theoliver333
                  </p>
                  <Krebit />
                </div>
                <p className="decentralized-users-item-content-id">rkRB 140</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="private">
        <div className="private-image"></div>
        <div className="private-content">
          <p className="private-content-title">
            We keep your life private so you can live.
          </p>
          <p className="private-content-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed et orci
            maximus, blandit enim non lorem ipsum dolor sit amet, consectetur
            adipiscing elit sed et orci maximus, blandit enim non.
          </p>
          <PrivateOptionQuestion isExtended={isExtended === 0}>
            <div
              className="questions-option-header"
              onClick={() => handleExtended(0)}
            >
              <p className="questions-option-title">Privacy</p>
              <Arrow />
            </div>
            <p className="questions-option-description">
              Hola! Texto de prueba
            </p>
          </PrivateOptionQuestion>
          <PrivateOptionQuestion isExtended={isExtended === 1}>
            <div
              className="questions-option-header"
              onClick={() => handleExtended(1)}
            >
              <p className="questions-option-title">Security</p>
              <Arrow />
            </div>
            <p className="questions-option-description">
              Hola! Texto de prueba
            </p>
          </PrivateOptionQuestion>
          <PrivateOptionQuestion isExtended={isExtended === 2}>
            <div
              className="questions-option-header"
              onClick={() => handleExtended(2)}
            >
              <p className="questions-option-title">Transparency</p>
              <Arrow />
            </div>
            <p className="questions-option-description">
              Hola! Texto de prueba
            </p>
          </PrivateOptionQuestion>
        </div>
      </div>
      <div className="private private-different">
        <div className="private-image"></div>
        <div className="private-content">
          <p className="private-content-title">
            We keep your life private so you can live.
          </p>
          <p className="private-content-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed et orci
            maximus, blandit enim non lorem ipsum dolor sit amet, consectetur
            adipiscing elit sed et orci maximus, blandit enim non.
          </p>
          <PrivateOptionQuestion isExtended={isExtended === 3}>
            <div
              className="questions-option-header"
              onClick={() => handleExtended(3)}
            >
              <p className="questions-option-title">Privacy</p>
              <Arrow />
            </div>
            <p className="questions-option-description">
              Hola! Texto de prueba
            </p>
          </PrivateOptionQuestion>
          <PrivateOptionQuestion isExtended={isExtended === 4}>
            <div
              className="questions-option-header"
              onClick={() => handleExtended(4)}
            >
              <p className="questions-option-title">Security</p>
              <Arrow />
            </div>
            <p className="questions-option-description">
              Hola! Texto de prueba
            </p>
          </PrivateOptionQuestion>
          <PrivateOptionQuestion isExtended={isExtended === 5}>
            <div
              className="questions-option-header"
              onClick={() => handleExtended(5)}
            >
              <p className="questions-option-title">Transparency</p>
              <Arrow />
            </div>
            <p className="questions-option-description">
              Hola! Texto de prueba
            </p>
          </PrivateOptionQuestion>
        </div>
      </div>
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
    </Wrapper>
  );
};
