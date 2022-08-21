import { Button } from 'components/Button';
import { Layout } from 'components/Layout';
import Image from 'next/image';

import { Background, Wrapper } from './styles';

export const Username = () => {
  return (
    <Layout>
      <Wrapper>
        <div className="profile-container">
          <Background image="/imgs/images/trust.jpg" />
          <div className="profile">
            <div className="profile-photo">
              <Image src="/imgs/images/andresmontoya.jpeg" layout="fill" />
            </div>
            <div className="profile-info">
              <div className="profile-info-naming">
                <span className="profile-info-name">andresmontoya.eth</span>{' '}
                <span className="profile-info-token">rkRB 140</span>
              </div>
              <div className="profile-info-follow">
                <span className="profile-info-followers">
                  200{' '}
                  <span className="profile-info-followers-text">Followers</span>
                </span>
                <span className="profile-info-follow-dot"></span>
                <span className="profile-info-followers">
                  200{' '}
                  <span className="profile-info-followers-text">Following</span>
                </span>
              </div>
            </div>
            <div className="profile-buttons">
              <Button text="Follow" onClick={() => {}} />
              <Button
                text="Send Message"
                onClick={() => {}}
                styleType="border"
              />
            </div>
          </div>
        </div>
        <h1>hey</h1>
        <h1>hey</h1>
        <h1>hey</h1>
        <h1>hey</h1>
        <h1>hey</h1>
        <h1>hey</h1>
        <h1>hey</h1>
      </Wrapper>
    </Layout>
  );
};
