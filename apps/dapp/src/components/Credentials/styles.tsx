import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  isLoading: boolean;
}

interface ICardProps {
  primaryColor: string;
  secondaryColor: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, isLoading }) => css`
    padding: 0 20px;

    @media (min-width: ${theme.screens.xl}) {
      padding: 0;
      margin-right: 80px;
      float: ${isLoading ? 'initial' : 'right'};
    }

    @media (min-width: ${theme.screens['2xl']}) {
      max-width: 1238px;
      margin: 0 auto;
      float: initial;
    }

    .credentials-loading {
      margin: 0 auto;
      margin-top: 20px;
      width: 60px;
      height: 60px;
    }

    .credentials-title {
      margin: 18px 0;
      font-family: 'HelveticaNowDisplay-Bold';
      font-size: ${theme.fonts.lg};
      color: ${theme.colors.white};

      @media (min-width: ${theme.screens.xl}) {
        margin-top: 65px;
        margin-bottom: 36px;
        font-size: ${theme.fonts['2xl']};
      }
    }

    .credentials-content {
      display: grid;
      grid-gap: 14px;

      @media (min-width: ${theme.screens.xl}) {
        grid-template-columns: repeat(3, 384px);
      }
    }
  `}
`;

export const Card = styled.div<ICardProps>`
  ${({ theme, primaryColor, secondaryColor }) => css`
    width: 100%;
    border-radius: 12px;
    padding: 16px 20px;
    background: linear-gradient(
      to top,
      ${theme.colors[primaryColor]},
      ${theme.colors[secondaryColor]}
    );
    backdrop-filter: blur(20px);
    cursor: pointer;
    position: relative;

    .card-title {
      margin: 0;
      font-family: 'HelveticaNowDisplay-Bold';
      font-size: ${theme.fonts.lg};
      color: ${theme.colors.white};

      @media (min-width: ${theme.screens.xl}) {
        font-size: ${theme.fonts['2xl']};
      }
    }

    .card-description {
      margin: 0;
      margin-top: 8px;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white}B3;
      line-height: 1.6;
    }

    .card-button {
      display: flex;
      align-items: center;
      margin-top: 40px;

      .card-button-text {
        margin: 0;
        margin-right: 9px;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
      }

      .card-button-icon {
        width: 20px;
        height: 20px;

        & > svg {
          width: 20px;
          height: 20px;
          fill: ${theme.colors.white};
        }
      }
    }

    .card-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 80px;
      height: 80px;

      & > svg {
        width: 80px;
        height: 80px;
      }
    }

    .card-brand {
      width: 80px;
      height: 80px;
      margin-top: 51px;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;

      & > img {
        width: 80px;
        height: 80px;
      }
    }
  `}
`;
