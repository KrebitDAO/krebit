import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Wrapper } from './styles';
import { Menu, Close, Logo } from 'components/Icons';
import { Button } from 'components/Button';
import { ConnectWallet } from 'components/ConnectWallet';
import { GeneralContext } from 'context';
import NavBarText from './index.text.json';

export const NavBar = () => {
  const {
    auth: { status },
    walletModal: { handleOpenConnectWallet, openConnectWallet }
  } = useContext(GeneralContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useRouter();

  const handleMenuOpen = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOpenWallet = () => {
    handleOpenConnectWallet();
    handleCloseMenu();
  };

  return (
    <>
      <ConnectWallet
        isOpen={openConnectWallet}
        onClose={handleOpenConnectWallet}
      />
      <Wrapper isMenuOpen={isMenuOpen}>
        <div className="header">
          <Link href="/">
            <div className="logo">
              <Logo />
            </div>
          </Link>
          <div className="menu" onClick={handleMenuOpen}>
            {isMenuOpen ? <Close /> : <Menu />}
          </div>
          <div className="menu-bar">
            <Link
              href="https://discord.gg/VHSq4ABsfz"
              rel="noopener noreferrer"
            >
              <a
                target="_blank"
                className="menu-bar-item"
                onClick={handleCloseMenu}
              >
                {NavBarText[locale]['menu-bar-items'][0]}
              </a>
            </Link>
            <Link href="https://docs.krebit.id/" rel="noopener noreferrer">
              <a
                target="_blank"
                className="menu-bar-item"
                onClick={handleCloseMenu}
              >
                {NavBarText[locale]['menu-bar-items'][1]}
              </a>
            </Link>
            <Link href="#hire">
              <a className="menu-bar-item" onClick={handleCloseMenu}>
                {NavBarText[locale]['menu-bar-items'][2]}
              </a>
            </Link>
            <Link
              href="https://d3x2s82dzfa.typeform.com/to/AvZMdnRp"
              rel="noopener noreferrer"
            >
              <a
                target="_blank"
                className="menu-bar-item"
                onClick={handleCloseMenu}
              >
                {NavBarText[locale]['menu-bar-items'][3]}
              </a>
            </Link>
            <div className="menu-bar-button">
              <Button
                text={NavBarText[locale]['menu-bar-button']}
                onClick={handleOpenWallet}
                isDisabled={status === 'pending'}
              />
            </div>
          </div>
        </div>
        <div className="menu-content">
          <Link href="https://discord.gg/VHSq4ABsfz" rel="noopener noreferrer">
            <a
              target="_blank"
              className="menu-content-item"
              onClick={handleCloseMenu}
            >
              {NavBarText[locale]['menu-bar-items'][0]}
            </a>
          </Link>
          <Link href="https://docs.krebit.id/" rel="noopener noreferrer">
            <a
              target="_blank"
              className="menu-content-item"
              onClick={handleCloseMenu}
            >
              {NavBarText[locale]['menu-bar-items'][1]}
            </a>
          </Link>
          <Link href="#hire">
            <a className="menu-content-item" onClick={handleCloseMenu}>
              {NavBarText[locale]['menu-bar-items'][2]}
            </a>
          </Link>
          <Link
            href="https://d3x2s82dzfa.typeform.com/to/AvZMdnRp"
            rel="noopener noreferrer"
          >
            <a
              target="_blank"
              className="menu-content-item"
              onClick={handleCloseMenu}
            >
              {NavBarText[locale]['menu-bar-items'][3]}
            </a>
          </Link>
          <div className="menu-content-button">
            <Button
              text={NavBarText[locale]['menu-bar-button']}
              onClick={handleOpenWallet}
              isDisabled={status === 'pending'}
            />
          </div>
        </div>
      </Wrapper>
    </>
  );
};
