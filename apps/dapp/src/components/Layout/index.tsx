import { FunctionComponent, ReactNode, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  MenuContentMobile,
  MenuMobile,
  NavBarDesktop,
  NavBarMobile,
  NavBarOption,
  Wrapper
} from './styles';
import {
  AccountBalanceWallet,
  ChromeReaderMode,
  Close,
  Explore,
  Help,
  Menu,
  Send,
  WorkExperience
} from 'components/Icons';
import { ConnectWallet } from 'components/ConnectWallet';
import { InlineDropdown } from 'components/InlineDropdown';
import { Loading } from 'components/Loading';
import { Badge } from 'components/Badge';
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
    title: 'Activity',
    href: '/posts',
    icon: <WorkExperience />
  },
  {
    title: 'Create',
    href: '/create',
    icon: <ChromeReaderMode />,
    isPrivate: true,
    badgeText: 'Beta',
    badgeColor: 'blueRibbon'
  },
  {
    title: 'Inbox',
    href: '/messages',
    icon: <Send />
  }
];

export const Layout: FunctionComponent<IProps> = props => {
  const { children } = props;
  const [isFilterOpenInView, setIsFilterOpenInView] = useState<string>();
  const {
    auth,
    profileInformation: { profile },
    walletModal: { openConnectWallet, handleOpenConnectWallet }
  } = useContext(GeneralContext);
  const [isMenuContentMobileOpen, setIsMenuContentMobileOpen] = useState(false);
  const [navBarDesktopOptionHovered, setNavBarDesktopOptionHovered] =
    useState<string>();
  const { push, asPath } = useRouter();
  const isLoading = auth.status === 'pending';

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

  const handleMenuContentMobileOpen = () => {
    setIsMenuContentMobileOpen(prevValue => !prevValue);
  };

  const handleNavBarDesktopOptionHovered = (value: string | undefined) => {
    setNavBarDesktopOptionHovered(value);
  };

  const handleHelp = () => {
    window.open('https://discord.gg/VHSq4ABsfz', '_blank');
  };

  return (
    <>
      <ConnectWallet
        isOpen={openConnectWallet}
        onClose={handleOpenConnectWallet}
      />
      <Wrapper>
        <MenuMobile profilePicture={formatUrlImage(profile?.picture)}>
          <div className="icon" onClick={handleMenuContentMobileOpen}>
            {isMenuContentMobileOpen ? <Close /> : <Menu />}
          </div>
          <div className="profile-menu">
            <div className="profile-menu-icon" onClick={handleHelp}>
              <Help />
            </div>
            {isLoading ? (
              <div className="profile-menu-loading">
                <Loading type="skeleton" />
              </div>
            ) : auth?.isAuthenticated ? (
              <>
                <div
                  className="profile-menu-image"
                  onClick={() => handleFilterOpen('mobile')}
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
                      onClose={() => handleFilterOpen(undefined)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div
                className="profile-menu-icon"
                onClick={handleOpenConnectWallet}
              >
                <AccountBalanceWallet />
              </div>
            )}
          </div>
        </MenuMobile>
        {isMenuContentMobileOpen && (
          <>
            <style global jsx>{`
              html,
              body {
                overflow: hidden;
              }
            `}</style>
            <MenuContentMobile>
              <div className="menu-content-mobile">
                <Link href="/" rel="noopener noreferrer">
                  <a
                    target=""
                    className="menu-content-mobile-item"
                    onClick={handleMenuContentMobileOpen}
                  >
                    Home
                  </a>
                </Link>
                <Link
                  href="https://discord.gg/VHSq4ABsfz"
                  rel="noopener noreferrer"
                >
                  <a
                    target="_blank"
                    className="menu-content-mobile-item"
                    onClick={handleMenuContentMobileOpen}
                  >
                    Discord
                  </a>
                </Link>
                <Link href="https://docs.krebit.id/" rel="noopener noreferrer">
                  <a
                    target="_blank"
                    className="menu-content-mobile-item"
                    onClick={handleMenuContentMobileOpen}
                  >
                    Docs
                  </a>
                </Link>
                <Link
                  href="https://d3x2s82dzfa.typeform.com/to/B63Gz2v0"
                  rel="noopener noreferrer"
                >
                  <a
                    target="_blank"
                    className="menu-content-mobile-item"
                    onClick={handleMenuContentMobileOpen}
                  >
                    Recruiters
                  </a>
                </Link>
                <Link
                  href="https://d3x2s82dzfa.typeform.com/to/AvZMdnRp"
                  rel="noopener noreferrer"
                >
                  <a
                    target="_blank"
                    className="menu-content-mobile-item"
                    onClick={handleMenuContentMobileOpen}
                  >
                    Credential Issuers
                  </a>
                </Link>
              </div>
            </MenuContentMobile>
          </>
        )}
        {children}
        <NavBarMobile
          isAuthenticated={auth.isAuthenticated}
          id="nav-bar-mobile"
        >
          {isLoading
            ? new Array(3).fill(0).map((_, index) => (
                <div className="navbar-mobile-loading" key={index}>
                  <Loading type="skeleton" />
                </div>
              ))
            : MENU_OPTIONS.filter(option =>
                auth.isAuthenticated ? option : !option.isPrivate
              ).map((content, index) => (
                <Link href={content.href} key={index}>
                  <NavBarOption isActive={asPath.includes(content.href)}>
                    <div className="option-icon">
                      {content.badgeText ? (
                        <Badge
                          icon={content.icon}
                          color={content.badgeColor}
                          iconColor={
                            asPath.includes(content.href) ? 'cyan' : 'gray'
                          }
                          text={content.badgeText}
                        />
                      ) : (
                        content.icon
                      )}
                    </div>
                  </NavBarOption>
                </Link>
              ))}
        </NavBarMobile>
        <NavBarDesktop profilePicture={formatUrlImage(profile?.picture)}>
          <div className="options">
            <div className="option-logo">
              <Link href="/" rel="noopener noreferrer">
                <a>
                  <img src="/imgs/logos/Krebit.svg" width={40} height={40} />
                </a>
              </Link>
            </div>
            {isLoading
              ? new Array(3).fill(0).map((_, index) => (
                  <div className="option-loading" key={index}>
                    <Loading type="skeleton" />
                  </div>
                ))
              : MENU_OPTIONS.filter(option =>
                  auth.isAuthenticated ? option : !option.isPrivate
                ).map((content, index) => (
                  <Link href={content.href} key={index}>
                    <NavBarOption
                      isActive={asPath.includes(content.href)}
                      onMouseEnter={() =>
                        handleNavBarDesktopOptionHovered(content.title)
                      }
                      onMouseLeave={() =>
                        handleNavBarDesktopOptionHovered(undefined)
                      }
                    >
                      <div className="option-icon">
                        {content.badgeText ? (
                          <Badge
                            icon={content.icon}
                            color={content.badgeColor}
                            iconColor={
                              asPath.includes(content.href) ? 'cyan' : 'gray'
                            }
                            text={content.badgeText}
                            onClick={() => {}}
                          />
                        ) : (
                          content.icon
                        )}
                      </div>
                      {navBarDesktopOptionHovered === content.title && (
                        <p className="option-hover">{content.title}</p>
                      )}
                    </NavBarOption>
                  </Link>
                ))}
          </div>
          <div className="option-profile-container">
            <NavBarOption
              isActive={false}
              onClick={handleHelp}
              onMouseEnter={() => handleNavBarDesktopOptionHovered('help')}
              onMouseLeave={() => handleNavBarDesktopOptionHovered(undefined)}
            >
              <div className="option-icon">
                <Help />
              </div>
              {navBarDesktopOptionHovered === 'help' && (
                <p className="option-hover">help</p>
              )}
            </NavBarOption>
            {isLoading ? (
              <div className="option-profile-loading">
                <Loading type="skeleton" />
              </div>
            ) : auth?.isAuthenticated ? (
              <div className="option-profile">
                <div
                  className="option-profile-image"
                  onClick={() => handleFilterOpen('desktop')}
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
                      onClose={() => handleFilterOpen(undefined)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <NavBarOption
                isActive={false}
                onClick={handleOpenConnectWallet}
                onMouseEnter={() => handleNavBarDesktopOptionHovered('wallet')}
                onMouseLeave={() => handleNavBarDesktopOptionHovered(undefined)}
              >
                <div className="option-icon">
                  <AccountBalanceWallet />
                </div>
                {navBarDesktopOptionHovered === 'wallet' && (
                  <p className="option-hover">Connect wallet</p>
                )}
              </NavBarOption>
            )}
          </div>
        </NavBarDesktop>
      </Wrapper>
    </>
  );
};
