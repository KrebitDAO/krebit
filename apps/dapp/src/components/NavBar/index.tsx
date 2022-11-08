import { useContext, useState } from 'react';
import Link from 'next/link';

import { Wrapper } from './styles';
import { Menu, Close, Logo } from 'components/Icons';
import { Button } from 'components/Button';
import { ConnectWallet } from 'components/ConnectWallet';
import { GeneralContext } from 'context';

export const NavBar = () => {
  const {
    walletModal: { handleOpenConnectWallet, openConnectWallet }
  } = useContext(GeneralContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                Discord
              </a>
            </Link>
            <Link href="https://docs.krebit.id/" rel="noopener noreferrer">
              <a
                target="_blank"
                className="menu-bar-item"
                onClick={handleCloseMenu}
              >
                Docs
              </a>
            </Link>
            <Link href="#hire">
              <a className="menu-bar-item" onClick={handleCloseMenu}>
                Recruiters
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
                Credential Issuers
              </a>
            </Link>
            <div className="menu-bar-button">
              <Button text="Try it now" onClick={handleOpenWallet} />
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
              Discord
            </a>
          </Link>
          <Link href="https://docs.krebit.id/" rel="noopener noreferrer">
            <a
              target="_blank"
              className="menu-content-item"
              onClick={handleCloseMenu}
            >
              Docs
            </a>
          </Link>
          <Link href="#hire">
            <a className="menu-content-item" onClick={handleCloseMenu}>
              Recruiters
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
              Credential Issuers
            </a>
          </Link>
          <div className="menu-content-button">
            <Button text="Try it now" onClick={handleOpenWallet} />
          </div>
        </div>
      </Wrapper>
    </>
  );
};
