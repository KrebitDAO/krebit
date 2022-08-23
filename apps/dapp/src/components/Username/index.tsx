import { Fragment } from 'react';
import Image from 'next/image';

import {
  Background,
  EducationCredentials,
  PersonhoodCredential,
  Skills,
  Wrapper
} from './styles';
import {
  Discord,
  Email,
  Krebit,
  Linkedin,
  Phone,
  Twitter
} from 'components/Icons';
import { Button } from 'components/Button';
import { Layout } from 'components/Layout';

const PERSONHOOD_CREDENTIALS = [
  {
    text: 'Discord',
    icon: <Discord />
  },
  {
    text: 'Twitter',
    icon: <Twitter />
  },
  {
    text: 'LinkedIn',
    icon: <Linkedin />
  },
  {
    text: 'Contact',
    icon: <Email />
  },
  {
    text: 'Phone',
    icon: <Phone />
  }
];

const MOCK_SKILLS = [
  'PHP expert',
  'Pascal evangelist',
  'Assembly builder',
  'C master',
  'C++ pro'
];

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
        <div className="content-container">
          <PersonhoodCredential>
            <div className="person-header">
              <p className="person-header-text">Personhood Credentials</p>
              <p className="person-header-text">Verify</p>
            </div>
            <div className="person-box">
              {PERSONHOOD_CREDENTIALS.map((item, index) => (
                <Fragment key={index}>
                  <div className="person-box-item">
                    <div className="person-box-item-icon">{item.icon}</div>
                    <p className="person-box-item-text">{item.text}</p>
                    <div className="person-box-item-icon">
                      <Krebit />
                    </div>
                  </div>
                  {index !== PERSONHOOD_CREDENTIALS.length - 1 && (
                    <hr className="person-box-item-hr" />
                  )}
                </Fragment>
              ))}
            </div>
          </PersonhoodCredential>
          <Skills>
            <div className="skills-header">
              <p className="skills-header-text">Skills</p>
            </div>
            <div className="skills-box">
              {MOCK_SKILLS.map((item, index) => (
                <div className="skills-box-item" key={index}>
                  <p className="skills-box-item-text">{item}</p>
                </div>
              ))}
            </div>
          </Skills>
          <EducationCredentials>
            <div className="education-header">
              <p className="education-header-text">Education credentials</p>
            </div>
            <div className="education-card">
              <div className="education-card-information">
                <p className="education-card-information-title">
                  English school
                </p>
                <p className="education-card-information-company">Platzi</p>
              </div>
              <div className="education-card-top-icon">
                <Krebit />
              </div>
              <div className="education-card-dates">
                <div className="education-card-date">
                  <p className="education-card-date-title">ISSUED</p>
                  <p className="education-card-date-text">02/11/2022</p>
                </div>
                <div className="education-card-date">
                  <p className="education-card-date-title">EXPIRES</p>
                  <p className="education-card-date-text">05/12/2024</p>
                </div>
              </div>
              <div className="education-card-bottom-icon">
                <Image src="/imgs/images/platzi.png" width={81} height={31} />
              </div>
            </div>
            <p className="education-view-more">View 7 more</p>
          </EducationCredentials>
        </div>
      </Wrapper>
    </Layout>
  );
};
