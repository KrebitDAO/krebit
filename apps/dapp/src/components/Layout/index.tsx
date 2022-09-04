import { FunctionComponent, ReactNode, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  MenuMobile,
  NavBarDesktop,
  NavBarMobile,
  NavBarOption,
  Wrapper
} from './styles';
import { Bell, Explore, Home, Menu, Send } from 'components/Icons';
import { GeneralContext } from 'context';

interface IProps {
  children: ReactNode;
}

const MENU_OPTIONS = [
  {
    title: 'Home',
    href: '/home',
    icon: <Home />
  },
  {
    title: 'Explore',
    href: '/explore',
    icon: <Explore />
  },
  {
    title: 'Inbox',
    href: '/messages',
    icon: <Send />
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: <Bell />
  }
];

export const Layout: FunctionComponent<IProps> = props => {
  const { children } = props;
  const {
    auth,
    profileInformation: { profile }
  } = useContext(GeneralContext);
  const { push, pathname } = useRouter();

  const handlePushProfile = () => {
    if (!auth) return;

    push(`/${profile.did}`);
  };

  return (
    <Wrapper>
      <MenuMobile>
        <div className="icon">
          <Menu />
        </div>
        {auth?.isAuthenticated && (
          <div className="photo" onClick={handlePushProfile}>
            <Image
              src={profile?.pfp || '/imgs/logos/Krebit.svg'}
              width={30}
              height={30}
            />
          </div>
        )}
      </MenuMobile>
      {children}
      <NavBarMobile>
        {MENU_OPTIONS.map((content, index) => (
          <Link href={content.href} key={index}>
            <NavBarOption isActive={content.href === pathname}>
              <div className="option-icon">{content.icon}</div>
              <p className="option-title">{content.title}</p>
            </NavBarOption>
          </Link>
        ))}
      </NavBarMobile>
      <NavBarDesktop>
        <div className="options">
          <div className="option-logo">
            <Image src="/imgs/logos/Krebit.svg" width={50} height={50} />
          </div>
          {MENU_OPTIONS.map((content, index) => (
            <Link href={content.href} key={index}>
              <NavBarOption isActive={content.href === pathname}>
                <div className="option-icon">{content.icon}</div>
                <p className="option-title">{content.title}</p>
              </NavBarOption>
            </Link>
          ))}
        </div>
        {auth?.isAuthenticated && (
          <div className="option-profile">
            <div className="profile" onClick={handlePushProfile}>
              <Image
                src={profile?.pfp || '/imgs/logos/Krebit.svg'}
                width={34}
                height={34}
              />
            </div>
            <p className="profile-text">Profile</p>
          </div>
        )}
      </NavBarDesktop>
    </Wrapper>
  );
};
