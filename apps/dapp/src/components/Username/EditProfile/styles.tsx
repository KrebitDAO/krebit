import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  image?: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme }) => css`
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

    .edit-box {
      background-color: ${theme.colors.bunting};
      border-radius: 0px;
      box-shadow: ${theme.shadows.smallest};
      padding: 20px;
      margin: 0 auto;
      width: 100%;
      height: 100%;
      overflow-y: auto;

      @media (min-width: ${theme.screens.lg}) {
        border-radius: 15px;
        width: 577px;
        height: 98%;
        padding: 36px 30px;
      }

      .edit-box-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .edit-box-header-title {
          margin: 0;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white}CC;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.xl};
          }
        }

        .edit-box-header-close {
          width: 24px;
          height: 24px;
          cursor: pointer;

          & > svg {
            width: 24px;
            height: 24px;
            fill: ${theme.colors.white};
          }
        }
      }

      .edit-box-loading {
        margin: 0 auto;
        margin-top: 20px;
        width: 60px;
        height: 60px;
      }

      .edit-box-list {
        display: grid;
        grid-gap: 20px;

        .edit-box-list-text {
          margin: 0;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white}CC;
        }

        .edit-box-button {
          width: 150px;
          height: 44px;
          justify-self: flex-end;
        }
      }
    }
  `}
`;

export const Background = styled.div<IProps>`
  ${({ theme, image }) => css`
    width: 100%;
    height: 120px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;

    ${image
      ? css`
          background-image: url(${image});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        `
      : css`
          background: linear-gradient(
            90deg,
            ${theme.colors.bunting} 0%,
            ${theme.colors.blueRibbon} 41%,
            ${theme.colors.cyan} 100%
          );
        `}

    .edit-box-list-background > svg {
      width: 40px;
      height: 40px;
      fill: ${theme.colors.white};
      cursor: pointer;
    }

    input {
      display: none;
    }
  `}
`;

export const Picture = styled.div<IProps>`
  ${({ theme, image }) => css`
    width: 120px;
    height: 120px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${theme.colors.white};

    ${image
      ? css`
          background-image: url(${image});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        `
      : css`
          background: linear-gradient(
            90deg,
            ${theme.colors.bunting} 0%,
            ${theme.colors.blueRibbon} 41%,
            ${theme.colors.cyan} 100%
          );
        `}

    .edit-box-list-picture > svg {
      width: 40px;
      height: 40px;
      fill: ${theme.colors.white};
      cursor: pointer;
    }

    input {
      display: none;
    }
  `}
`;
