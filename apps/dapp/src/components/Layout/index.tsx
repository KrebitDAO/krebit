import { FunctionComponent, ReactNode, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  MenuMobile,
  NavBarDesktop,
  NavBarMobile,
  NavBarOption,
  Wrapper,
  Image
} from './styles';
import { Bell, Explore, Home, Menu, Send } from 'components/Icons';
import { InlineDropdown } from 'components/InlineDropdown';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    auth,
    profileInformation: { profile }
  } = useContext(GeneralContext);
  const { push, pathname } = useRouter();

  const handlePushProfile = () => {
    if (!auth) return;

    handleFilterOpen();
    push(`/${profile.did}`);
  };

  const handleLogout = () => {
    if (!window) return;

    auth.logout();
    push(`/`);
  };

  const handleFilterOpen = () => {
    setIsFilterOpen(prevState => !prevState);
  };

  return (
    <Wrapper>
      <MenuMobile>
        <div className="icon">
          <Menu />
        </div>
        {auth?.isAuthenticated && (
          <div className="profile-menu">
            <Image
              src={profile.picture || '/imgs/logos/Krebit.svg'}
              width={30}
              height={30}
              onClick={handleFilterOpen}
            />
            {isFilterOpen && (
              <div className="profile-menu-dropdown">
                <InlineDropdown
                  items={[
                    {
                      title: 'My profile',
                      onClick: handlePushProfile
                    },
                    {
                      title: 'Log out',
                      onClick: handleLogout
                    }
                  ]}
                />
              </div>
            )}
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
            <img src="/imgs/logos/Krebit.svg" width={50} height={50} />
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
          <div className="option-profile-container">
            <div className="option-profile">
              <Image
                src={profile.picture || '/imgs/logos/Krebit.svg'}
                width={34}
                height={34}
                onClick={handleFilterOpen}
              />
              <p className="profile-text">Profile</p>
            </div>
            {isFilterOpen && (
              <div className="option-profile-dropdown">
                <InlineDropdown
                  items={[
                    {
                      title: 'My profile',
                      onClick: handlePushProfile
                    },
                    {
                      title: 'Log out',
                      onClick: handleLogout
                    }
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </NavBarDesktop>
    </Wrapper>
  );
};
