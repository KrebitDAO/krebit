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
  Token,
  Close,
  Explore,
  Help,
  Menu,
  Send,
  Home,
  Login,
  Notifications as NotificationsIcon
} from 'components/Icons';
import { ConnectWallet } from 'components/ConnectWallet';
import { InlineDropdown } from 'components/InlineDropdown';
import { Loading } from 'components/Loading';
import { Badge } from 'components/Badge';
import { Notifications } from 'components/Notifications';
import { GeneralContext } from 'context';
import { formatUrlImage } from 'utils';
import LayoutText from './index.text.json';

interface IProps {
  children: ReactNode;
}

const MENU_OPTIONS = (locale: string) => [
  {
    title: LayoutText[locale]['nav-bar']['menu-options'][0],
    href: '/posts',
    icon: <Home />,
    badgeText: LayoutText[locale]['badge-texts'][0]
  },
  {
    title: LayoutText[locale]['nav-bar']['menu-options'][1],
    href: '/explore',
    icon: <Explore />
  },
  {
    title: LayoutText[locale]['nav-bar']['menu-options'][2],
    href: '/create',
    icon: <Token />,
    isPrivate: true,
    badgeText: LayoutText[locale]['badge-texts'][1],
    badgeColor: 'blueRibbon'
  },
  {
    title: LayoutText[locale]['nav-bar']['menu-options'][3],
    href: '/messages',
    icon: <Send />,
    isPrivate: true
  }
];

export const Layout: FunctionComponent<IProps> = props => {
  const { children } = props;
  const [isFilterOpenInView, setIsFilterOpenInView] = useState<string>();
  const {
    auth,
    profileInformation: { profile },
    walletModal: { openConnectWallet, handleOpenConnectWallet },
    notifications: { count: notificationsCount }
  } = useContext(GeneralContext);
  const [isMenuContentMobileOpen, setIsMenuContentMobileOpen] = useState(false);
  const [navBarDesktopOptionHovered, setNavBarDesktopOptionHovered] =
    useState<string>();
  const [areNotificationsOpen, setAreNotificationsOpen] = useState(false);
  const { push, asPath, locale } = useRouter();
  const isLoading = auth.status === 'pending';

  const handlePushProfile = () => {
    if (!auth.isAuthenticated) return;

    handleFilterOpen(undefined);
    push(`/${profile.did}`);
  };

  const handleLogout = async () => {
    if (!window) return;

    await auth.logout().then(() => {
      window.open('/', '_self');
    });
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

  const handleNotificationsOpen = (status: boolean) => {
    setAreNotificationsOpen(status);
  };

  return (
    <>
      <ConnectWallet
        isOpen={openConnectWallet}
        onClose={handleOpenConnectWallet}
      />
      <Notifications
        isModalOpen={areNotificationsOpen}
        onClose={handleNotificationsOpen}
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
                  className="profile-menu-icon"
                  onClick={() => handleNotificationsOpen(true)}
                >
                  <Badge
                    icon={<NotificationsIcon />}
                    text={
                      notificationsCount?.social
                        ? notificationsCount?.social?.toString()
                        : undefined
                    }
                  />
                </div>
                <div
                  className="profile-menu-image"
                  onClick={() => handleFilterOpen('mobile')}
                />
                {isFilterOpenInView === 'mobile' && (
                  <div className="profile-menu-dropdown">
                    <InlineDropdown
                      items={[
                        {
                          title:
                            LayoutText[locale].menu['inline-dropdown-items'][0],
                          onClick: handlePushProfile
                        },
                        {
                          title:
                            LayoutText[locale].menu['inline-dropdown-items'][1],
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
                <Login />
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
                    {LayoutText[locale]['menu-content-mobile'].items[0]}
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
                    {LayoutText[locale]['menu-content-mobile'].items[1]}
                  </a>
                </Link>
                <Link href="https://docs.krebit.id/" rel="noopener noreferrer">
                  <a
                    target="_blank"
                    className="menu-content-mobile-item"
                    onClick={handleMenuContentMobileOpen}
                  >
                    {LayoutText[locale]['menu-content-mobile'].items[2]}
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
                    {LayoutText[locale]['menu-content-mobile'].items[3]}
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
                    {LayoutText[locale]['menu-content-mobile'].items[4]}
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
            : MENU_OPTIONS(locale)
                .filter(option =>
                  auth.isAuthenticated ? option : !option.isPrivate
                )
                .map((content, index) => (
                  <Link href={content.href} key={index}>
                    <NavBarOption isActive={asPath.includes(content.href)}>
                      <div className="option-icon">
                        {content.title ===
                        LayoutText[locale]['nav-bar']['menu-options'][3] ? (
                          <Badge
                            icon={content.icon}
                            color={
                              notificationsCount?.messages
                                ? 'rose'
                                : content.badgeColor
                            }
                            iconColor={
                              asPath.includes(content.href) ? 'cyan' : 'gray'
                            }
                            text={
                              notificationsCount?.messages
                                ? notificationsCount?.messages.toString()
                                : content.badgeText
                            }
                          />
                        ) : content.badgeText ? (
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
          {!isLoading && !auth?.isAuthenticated ? (
            <NavBarOption isActive={false} onClick={handleHelp}>
              <div className="option-icon">
                <Help />
              </div>
            </NavBarOption>
          ) : null}
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
              : MENU_OPTIONS(locale)
                  .filter(option =>
                    auth.isAuthenticated ? option : !option.isPrivate
                  )
                  .map((content, index) => (
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
                          {content.title ===
                          LayoutText[locale]['nav-bar']['menu-options'][3] ? (
                            <Badge
                              icon={content.icon}
                              color={
                                notificationsCount?.messages
                                  ? 'rose'
                                  : content.badgeColor
                              }
                              iconColor={
                                asPath.includes(content.href) ? 'cyan' : 'gray'
                              }
                              text={
                                notificationsCount?.messages
                                  ? notificationsCount?.messages.toString()
                                  : content.badgeText
                              }
                            />
                          ) : content.badgeText ? (
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
                <p className="option-hover">
                  {LayoutText[locale]['nav-bar']['menu-options'][4]}
                </p>
              )}
            </NavBarOption>
            {isLoading ? (
              <div className="option-profile-loading">
                <Loading type="skeleton" />
              </div>
            ) : auth?.isAuthenticated ? (
              <>
                <NavBarOption
                  isActive={false}
                  onClick={() => handleNotificationsOpen(true)}
                  onMouseEnter={() =>
                    handleNavBarDesktopOptionHovered('notifications')
                  }
                  onMouseLeave={() =>
                    handleNavBarDesktopOptionHovered(undefined)
                  }
                >
                  <div className="option-icon">
                    <Badge
                      icon={<NotificationsIcon />}
                      iconColor="gray"
                      text={
                        notificationsCount?.social
                          ? notificationsCount?.social?.toString()
                          : undefined
                      }
                    />
                  </div>
                  {navBarDesktopOptionHovered === 'notifications' && (
                    <p className="option-hover">
                      {LayoutText[locale]['nav-bar']['menu-options'][5]}
                    </p>
                  )}
                </NavBarOption>
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
                            title:
                              LayoutText[locale].menu[
                                'inline-dropdown-items'
                              ][0],
                            onClick: handlePushProfile
                          },
                          {
                            title:
                              LayoutText[locale].menu[
                                'inline-dropdown-items'
                              ][1],
                            onClick: handleLogout
                          }
                        ]}
                        onClose={() => handleFilterOpen(undefined)}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <NavBarOption
                isActive={false}
                onClick={handleOpenConnectWallet}
                onMouseEnter={() => handleNavBarDesktopOptionHovered('wallet')}
                onMouseLeave={() => handleNavBarDesktopOptionHovered(undefined)}
              >
                <div className="option-icon">
                  <Login />
                </div>
                {navBarDesktopOptionHovered === 'wallet' && (
                  <p className="option-hover">
                    {LayoutText[locale]['nav-bar']['menu-options'][6]}
                  </p>
                )}
              </NavBarOption>
            )}
          </div>
        </NavBarDesktop>
      </Wrapper>
    </>
  );
};
