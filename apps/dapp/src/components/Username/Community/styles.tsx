import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  isHidden: boolean;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, isHidden }) => css`
    transition: all 0.2s ease;
    margin-top: 32px;

    ${isHidden &&
    css`
      height: 0;
      opacity: 0;
      margin: 0;
      visibility: hidden;
    `}

    @media (min-width: ${theme.screens.lg}) {
      margin-top: 36px;

      ${isHidden &&
      css`
        margin: 0;
      `}
    }

    .community-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .community-header-text-container {
        display: flex;
        align-items: center;

        .community-header-text {
          margin: 0;
          font-size: ${theme.fonts.lg};
          color: ${theme.colors.white};
        }

        .community-header-text-open-new {
          width: 15px;
          height: 15px;
          cursor: pointer;
          margin-left: 10px;

          & > svg {
            width: 15px;
            height: 15px;
            fill: ${theme.colors.white};
          }
        }
      }

      .community-header-verify {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        background-color: ${theme.colors.brightGray};
        border-radius: 20px;
        padding: 6px 10px;
        cursor: pointer;
      }

      .community-header-filter {
        position: relative;

        .community-header-filter-text {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
          background-color: ${theme.colors.brightGray};
          border-radius: 20px;
          padding: 6px 10px;
          cursor: pointer;
        }

        .community-header-filter-content {
          position: absolute;
          top: 40px;
          right: 0;
          z-index: 10;
        }
      }
    }

    .community-cards {
      display: grid;
      grid-gap: 17px;

      @media (min-width: ${theme.screens.lg}) {
        grid-template-columns: repeat(2, 1fr);
      }

      .community-card-loading {
        height: 145px;

        @media (min-width: ${theme.screens.lg}) {
          height: 155px;
        }
      }
    }
  `}
`;
