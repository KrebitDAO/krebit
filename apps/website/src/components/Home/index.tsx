import { Wrapper } from './styles';
import { Button } from 'components/Button';
import { Play } from 'components/Icons';

export const Home = () => {
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
      </div>
    </Wrapper>
  );
};
