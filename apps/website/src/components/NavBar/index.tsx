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
          <a className="menu-bar-item">Discord</a>
          <a className="menu-bar-item">Blog</a>
          <a className="menu-bar-item">Docs</a>
          <a className="menu-bar-item">Recruiters</a>
          <a className="menu-bar-item">Verifiers</a>
          <div className="menu-bar-button">
            <Button
              text="Connect wallet"
              primaryColor="cyan"
              secondaryColor="rose"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="menu-content">
        <a className="menu-content-item">Discord</a>
        <a className="menu-content-item">Blog</a>
        <a className="menu-content-item">Docs</a>
        <a className="menu-content-item">Recruiters</a>
        <a className="menu-content-item">Verifiers</a>
        <div className="menu-content-button">
          <Button
            text="Connect wallet"
            primaryColor="rose"
            secondaryColor="blueRibbon"
            onClick={() => {}}
          />
        </div>
      </div>
    </Wrapper>
  );
};
