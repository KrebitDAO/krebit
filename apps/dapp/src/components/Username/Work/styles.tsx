import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    margin-top: 36px;

    .work-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .work-header-text {
        margin: 0;
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
      }

      .work-header-verify {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        background-color: ${theme.colors.brightGray};
        border-radius: 20px;
        padding: 6px 10px;
        cursor: pointer;
      }

      .work-header-filter {
        position: relative;

        .work-header-filter-text {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
          background-color: ${theme.colors.brightGray};
          border-radius: 20px;
          padding: 6px 10px;
          cursor: pointer;
        }

        .work-header-filter-content {
          position: absolute;
          top: 40px;
          right: 0;
          z-index: 10;
        }
      }
    }

    .work-cards {
      display: grid;
      grid-gap: 17px;
    }

    .work-view-more {
      margin: 0;
      margin-top: 20px;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white};
      text-decoration: underline;
      text-align: center;

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 36px;
        font-size: ${theme.fonts.base};
      }
    }
  `}
`;