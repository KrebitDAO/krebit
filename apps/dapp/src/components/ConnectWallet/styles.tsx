import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface WalletProps {
  status: string;
}

interface WalletButtonProps {
  textColor: string;
}

export const Wrapper = styled.div<WalletProps>`
  ${({ theme, status }) => css`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 20;
    width: 100vw;
    height: 100vh;
    background-color: ${theme.colors.white}0D;
    backdrop-filter: saturate(180%) blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;

    .wallet {
      background-color: ${theme.colors.bunting};
      width: 313px;
      height: 348px;
      border-radius: 15px;
      box-shadow: ${theme.shadows.smallest};
      padding: 36px 28px;
      display: ${status === 'pending' ? 'initial' : 'grid'};
      grid-gap: 48px;

      @media (min-width: ${theme.screens.lg}) {
        width: 426px;
        height: 396px;
      }

      .wallet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .wallet-header-title {
          font-size: ${theme.fonts.lg};
          color: ${theme.colors.white};
          margin: 0;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.xl};
          }
        }

        .wallet-header-close {
          cursor: pointer;

          & > svg {
            fill: ${theme.colors.white};
            width: 24px;
            height: 24px;
          }
        }
      }

      .wallet-buttons {
        display: grid;
        grid-template-rows: repeat(2, 56px);
        grid-gap: 16px;

        @media (min-width: ${theme.screens.lg}) {
          grid-template-rows: repeat(2, 69px);
        }
      }

      .wallet-read {
        text-decoration: underline;
        color: ${theme.colors.white};
        font-size: ${theme.fonts.base};
        text-align: center;
        cursor: pointer;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.xl};
        }
      }
    }

    .loading-title {
      font-size: ${theme.fonts.lg};
      color: ${theme.colors.white};
      margin: 0;
      margin-bottom: 48px;
      text-align: center;

      @media (min-width: ${theme.screens.lg}) {
        font-size: ${theme.fonts.xl};
      }
    }

    .loading-view {
      display: grid;
      justify-content: center;

      .loading-view-text {
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        margin: 0;
        margin-top: 20px;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.sm};
        }
      }
    }
  `}
`;

export const WalletButton = styled.button<WalletButtonProps>`
  ${({ theme, textColor }) => css`
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background-color: ${theme.colors.transparent};
    color: ${theme.colors[textColor]};
    border: 1px solid ${theme.colors[textColor]}B3;
    font-family: 'HelveticaNowDisplay-Medium';
    font-size: ${theme.fonts.base};
    display: flex;
    justify-content: center;
    align-items: center;
    grid-gap: 20px;
    cursor: pointer;

    @media (min-width: ${theme.screens.lg}) {
      font-size: ${theme.fonts.xl};
    }

    & > img {
      width: 30px;
      height: 24px;
    }
  `}
`;
