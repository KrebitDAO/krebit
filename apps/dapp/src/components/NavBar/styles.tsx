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
      ? theme.colors.tangaro
      : theme.colors.transparent};

    @media (min-width: ${theme.screens.lg}) {
      padding: 23px 50px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .logo {
        cursor: pointer;
        z-index: 20;

        & > svg {
          width: 110px;
          height: 40px;

          @media (min-width: ${theme.screens.lg}) {
            height: 51px;
            width: 153px;
          }

          & > .color {
            fill: ${theme.colors.white};
          }
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
          fill: ${theme.colors.white};
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
        color: ${theme.colors.white};
        margin: 0;
        margin-top: 27px;

        &:first-of-type {
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
