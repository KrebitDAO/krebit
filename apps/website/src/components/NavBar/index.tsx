import { useState } from 'react';
import Link from 'next/link';

import { Wrapper } from './styles';
import { Menu, Close, Logo } from 'components/Icons';
import { Button } from 'components/Button';

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
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
            href="https://discord.gg/y7sMYVjxrd"
            rel="noopener noreferrer"
          >
            <a target="_blank" className="menu-bar-item">Discord</a>
          </Link>
          <Link
            href="https://docs.krebit.id/"            
            rel="noopener noreferrer"
          >
            <a target="_blank" className="menu-bar-item">Docs</a>
          </Link>
          <Link href="#hire">
            <a className="menu-bar-item">Recruiters</a>
          </Link>
          <a className="menu-bar-item">Credential Issuers</a>
          <div className="menu-bar-button">
            <Button
              text="Try the Beta"
              primaryColor="cyan"
              secondaryColor="rose"
              onClick={() => {window.open('https://testnet.krebit.id')}}
            />
          </div>
        </div>
      </div>
      <div className="menu-content">
        <Link
          href="https://discord.gg/y7sMYVjxrd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <a className="menu-content-item">Discord</a>
        </Link>
        <a className="menu-content-item">Blog</a>
        <a className="menu-content-item">Docs</a>
        <Link href="#hire">
          <a className="menu-content-item" onClick={handleCloseMenu}>
            Recruiters
          </a>
        </Link>
        <a className="menu-content-item">Credential Issuers</a>
        <div className="menu-content-button">
          <Button
            text="Try the Beta"
            primaryColor="rose"
            secondaryColor="blueRibbon"
            onClick={() => {window.open('https://testnet.krebit.id')}}
          />
        </div>
      </div>
    </Wrapper>
  );
};
