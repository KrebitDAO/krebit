import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  shouldShowMoreVert?: boolean;
}

export const SimpleCardWrapper = styled.div<IProps>`
  ${({ theme, shouldShowMoreVert }) => css`
    display: grid;
    grid-template-columns: ${shouldShowMoreVert
      ? '26px auto 56px'
      : '26px auto 26px'};
    background-color: ${theme.colors.white}0D;
    border: 1px solid ${theme.colors.scorpion}80;
    border-radius: 15px;
    padding: 16px;

    .card-icon {
      width: 26px;
      height: 26px;

      & > svg {
        width: 26px;
        height: 26px;
      }
    }

    .card-item-texts {
      margin-left: 14px;

      .card-item-title {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
      }

      .card-item-description {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
      }

      .card-item-dates {
        display: flex;
        grid-gap: 14px;
        margin-top: 31px;

        .card-item-date {
          .card-item-date-title {
            margin: 0;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white}B3;
          }

          .card-item-date-text {
            margin: 0;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white};
          }
        }
      }
    }

    .card-item-content {
      position: relative;
      display: flex;

      .card-item-icon {
        & > svg {
          opacity: 0.2;
        }
      }

      .card-item-icon-is-active {
        & > svg {
          opacity: 1;
        }
      }

      .card-more-vert {
        width: 30px;
        height: 26px;
        text-align: center;
        cursor: pointer;

        & > svg {
          width: 30px;
          height: 26px;
          fill: ${theme.colors.white};
        }
      }

      .card-item-tooltip-box {
        position: absolute;

        ${shouldShowMoreVert
          ? css`
              top: -40px;
              right: 50px;
            `
          : css`
              top: -40px;
              right: 20px;
            `}
      }

      .card-more-vert-inline-dropdown {
        position: absolute;
        bottom: 86px;
        right: 30px;
        z-index: 10;

        @media (min-width: ${theme.screens.lg}) {
          bottom: 86px;
          right: initial;
          left: 56px;
        }
      }
    }
  `}
`;
