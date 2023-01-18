import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { animated } from '@react-spring/web';

// types
import { ICardProps } from './credentialCard';

interface IProps {
  isLoading: boolean;
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
      margin-bottom: 100px;

      @media (min-width: ${theme.screens.xl}) {
        grid-template-columns: repeat(3, 384px);
      }

      @media (min-width: ${theme.screens['2xl']}) {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `}
`;

export const CardContainer = styled.div`
  ${({ theme }) => css`
    position: relative;
  `}
`;

export const Card = styled(animated.div)<ICardProps>`
  ${({
    theme,
    primaryColor = 'bunting',
    secondaryColor = 'gray',
    smaller,
    frontChildren
  }) => css`
    position: ${frontChildren ? 'absolute' : 'initial'};
    width: 100%;
    min-height: 220px;
    height: 100%;
    border-radius: 12px;
    padding: 16px 20px;
    background: linear-gradient(
      to top,
      ${theme.colors[primaryColor]}CC,
      ${theme.colors[secondaryColor]}CC
    );
    backdrop-filter: blur(20px);
    cursor: pointer;
    will-change: transform, opacity;

    .card-title {
      margin: 0;
      font-family: 'HelveticaNowDisplay-Bold';
      font-size: ${smaller ? theme.fonts.base : theme.fonts.lg};
      color: ${theme.colors.white};
      word-wrap: break-word;

      @media (min-width: ${theme.screens.xl}) {
        font-size: ${smaller ? theme.fonts.xl : theme.fonts['2xl']};
      }
    }

    .card-description {
      margin: 0;
      margin-top: 8px;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white}B3;
      line-height: 1.6;
      word-wrap: break-word;
    }

    .card-bottom {
      position: absolute;
      bottom: 5px;
      right: 20px;
      left: 20px;
      display: flex;
      align-items: center;

      .card-dates {
        display: flex;
        grid-gap: 14px;

        .card-date {
          .card-date-title {
            margin: 0;
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.white}B3;
          }

          .card-date-text {
            margin: 0;
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.white};
            font-family: 'HelveticaNowDisplay-Medium';
          }
        }
      }

      .card-button {
        display: flex;
        align-items: center;

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
        margin-left: auto;
        width: ${smaller ? '60px' : '80px'};
        height: ${smaller ? '60px' : '80px'};

        & > svg {
          width: ${smaller ? '60px' : '80px'};
          height: ${smaller ? '60px' : '80px'};
          fill: ${theme.colors.white};
        }
      }

      .card-brand {
        width: ${smaller ? '60px' : '80px'};
        height: ${smaller ? '60px' : '80px'};
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: center;

        & > img,
        & > svg {
          fill: ${theme.colors.white};
          width: ${smaller ? '60px' : '80px'};
          height: ${smaller ? '60px' : '80px'};
        }
      }
    }
  `}
`;
