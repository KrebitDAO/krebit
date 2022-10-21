import {
  FunctionComponent,
  ReactNode,
  useContext,
  useRef,
  useState
} from 'react';
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
import { InlineDropdown } from 'components/InlineDropdown';
import { GeneralContext } from 'context';
import { formatUrlImage } from 'utils';

interface IProps {
  children: ReactNode;
}

const MENU_OPTIONS = [
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
  const [isFilterOpenInView, setIsFilterOpenInView] = useState<string>();
  const {
    auth,
    profileInformation: { profile }
  } = useContext(GeneralContext);
  const parentDropdownMobileRef = useRef(null);
  const parentDropdownDesktopRef = useRef(null);
  const { push, asPath } = useRouter();

  const handlePushProfile = () => {
    if (!auth.isAuthenticated) return;

    handleFilterOpen(undefined);
    push(`/${profile.did}`);
  };

  const handleLogout = () => {
    if (!window) return;

    auth.logout();
    push(`/`);
  };

  const handleFilterOpen = (view: string | undefined) => {
    setIsFilterOpenInView(view);
  };

  return (
    <Wrapper>
      <MenuMobile profilePicture={formatUrlImage(profile?.picture)}>
        <div className="icon">
          <Menu />
        </div>
        {auth?.isAuthenticated && (
          <div className="profile-menu">
            <div
              className="profile-menu-image"
              onClick={() => handleFilterOpen('mobile')}
              ref={parentDropdownMobileRef}
            />
            {isFilterOpenInView === 'mobile' && (
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
                  parentRef={parentDropdownMobileRef}
                  onClose={() => handleFilterOpen(undefined)}
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
            <NavBarOption isActive={asPath.includes(content.href)}>
              <div className="option-icon">{content.icon}</div>
            </NavBarOption>
          </Link>
        ))}
      </NavBarMobile>
      <NavBarDesktop profilePicture={formatUrlImage(profile?.picture)}>
        <div className="options">
          <div className="option-logo">
            <img src="/imgs/logos/Krebit.svg" width={40} height={40} />
          </div>
          {MENU_OPTIONS.map((content, index) => (
            <Link href={content.href} key={index}>
              <NavBarOption isActive={asPath.includes(content.href)}>
                <div className="option-icon">{content.icon}</div>
              </NavBarOption>
            </Link>
          ))}
        </div>
        {auth?.isAuthenticated && (
          <div className="option-profile-container">
            <div
              className="option-profile-image"
              onClick={() => handleFilterOpen('desktop')}
              ref={parentDropdownDesktopRef}
            />
            {isFilterOpenInView === 'desktop' && (
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
                  parentRef={parentDropdownDesktopRef}
                  onClose={() => handleFilterOpen(undefined)}
                />
              </div>
            )}
          </div>
        )}
      </NavBarDesktop>
    </Wrapper>
  );
};
