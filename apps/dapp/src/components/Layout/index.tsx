import { FunctionComponent, ReactNode } from 'react';
import Image from 'next/image';

import {
  MenuMobile,
  NavBarDesktop,
  NavBarMobile,
  NavBarOption,
  Wrapper
} from './styles';
import { Bell, Explore, Home, Menu, Send } from 'components/Icons';

interface IProps {
  children: ReactNode;
}

const MENU_OPTIONS = [
  {
    title: 'Home',
    icon: <Home />
  },
  {
    title: 'Explore',
    icon: <Explore />
  },
  {
    title: 'Inbox',
    icon: <Send />
  },
  {
    title: 'Notifications',
    icon: <Bell />
  }
];

export const Layout: FunctionComponent<IProps> = props => {
  const { children } = props;

  return (
    <Wrapper>
      <MenuMobile>
        <div className="icon">
          <Menu />
        </div>
        <div className="photo">
          <Image src="/imgs/images/andresmontoya.jpeg" width={30} height={30} />
        </div>
      </MenuMobile>
      {children}
      <NavBarMobile>
        {MENU_OPTIONS.map((content, index) => (
          <NavBarOption isActive={index === 0} key={index}>
            <div className="option-icon">{content.icon}</div>
            <p className="option-title">{content.title}</p>
          </NavBarOption>
        ))}
      </NavBarMobile>
      <NavBarDesktop>
        <div className="options">
          <div className="option-logo">
            <Image src="/imgs/logos/Krebit.svg" width={50} height={50} />
          </div>
          {MENU_OPTIONS.map((content, index) => (
            <NavBarOption isActive={index === 0} key={index}>
              <div className="option-icon">{content.icon}</div>
              <p className="option-title">{content.title}</p>
            </NavBarOption>
          ))}
        </div>
        <div className="option-profile">
          <div className="profile">
            <Image
              src="/imgs/images/andresmontoya.jpeg"
              width={34}
              height={34}
            />
          </div>
          <p className="profile-text">Profile</p>
        </div>
      </NavBarDesktop>
    </Wrapper>
  );
};
