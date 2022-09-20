import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    .community-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .community-header-text {
        margin: 0;
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
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
    }

    .community-view-more {
      margin: 0;
      margin-top: 20px;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white};
      text-decoration: underline;
      text-align: center;
      cursor: pointer;

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 36px;
        font-size: ${theme.fonts.base};
      }
    }
  `}
`;