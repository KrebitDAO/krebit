import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface Props {
  isMenuOpen: boolean;
}

export const Wrapper = styled.nav<Props>`
  ${({ theme, isMenuOpen }) => css`
    padding: 20px 20px ${isMenuOpen ? '72px' : '20px'} 20px;
    position: ${isMenuOpen ? 'fixed' : 'absolute'};
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    background-color: ${isMenuOpen
      ? theme.colors.white
      : theme.colors.transparent};

    @media (min-width: ${theme.screens.lg}) {
      padding: 23px 50px;
    }

    /* .menu-ellipse-6 {
      background-image: url('/imgs/backgrounds/Ellipse_6.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      width: 614px;
      height: 650px;
      position: absolute;
      left: -202px;
      top: -30px;
      background-color: ${theme.colors.cyan};
      filter: blur(300px);
    }

    .menu-ellipse-12 {
      background-image: url('/imgs/backgrounds/Ellipse_12.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      width: 400px;
      height: 399px;
      position: absolute;
      left: -63px;
      top: 386px;
      background-color: ${theme.colors.white};
      filter: blur(300px);
    }

    .menu-ellipse-16 {
      background-image: url('/imgs/backgrounds/Ellipse_16.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      width: 459px;
      height: 459px;
      position: absolute;
      left: 110px;
      top: -48px;
      background-color: ${theme.colors.blueRibbon};
      filter: blur(300px);
    } */

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .logo {
        width: 101px;
        height: 35px;
        background-image: url('/imgs/logos/Logo.svg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        cursor: pointer;
        z-index: 20;

        @media (min-width: ${theme.screens.lg}) {
          height: 51px;
          width: 153px;
        }
      }

      .menu {
        z-index: 20;

        @media (min-width: ${theme.screens.lg}) {
          display: none;
        }

        svg {
          width: 30px;
          height: 30px;
          fill: ${theme.colors.bunting};
        }
      }

      .menu-bar {
        display: none;

        @media (min-width: ${theme.screens.lg}) {
          display: flex;
          align-items: center;
          grid-gap: 36px;
          z-index: 20;
        }

        .menu-bar-item {
          color: ${theme.colors.cyan};
          font-size: ${theme.fonts.base};
          font-family: 'HelveticaNowDisplay-Medium';
          cursor: pointer;
        }

        .menu-bar-button {
          height: 58px;
          width: 211px;
        }
      }
    }

    .menu-content {
      display: ${isMenuOpen ? 'block' : 'none'};
      min-height: calc(100vh - 161px);
      height: 100%;
      position: relative;

      @media (min-width: ${theme.screens.lg}) {
        display: none;
      }

      .menu-content-item {
        display: block;
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.xl};
        color: ${theme.colors.bunting};
        margin: 0;
        margin-top: 27px;

        &:first-child {
          margin-top: 33px;
        }
      }

      .menu-content-button {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 58px;
      }
    }
  `}
`;
