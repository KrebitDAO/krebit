import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  headerStatusColor?: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, headerStatusColor }) => css`
    max-width: 670px;
    margin: 0 20px;
    margin-top: 20px;

    @media (min-width: ${theme.screens.lg}) {
      margin: 0 auto;
      margin-top: 20px;
    }

    .loading {
      width: 60px;
      height: 60px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;

      .header-text {
        margin: 0;
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
      }

      .header-status {
        background-color: ${theme.colors[headerStatusColor]};
        border-radius: 20px;

        .header-status-text {
          margin: 0;
          padding: 5px 10px;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
        }
      }
    }

    .card-content-description {
      margin: 0;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white}B3;
    }

    .card-content-dots {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: underline;
    }

    .card-content-list {
      margin: 15px 0;
      padding: 0;
      padding-inline-start: 20px;
    }

    .card-container {
      margin: 20px 0;
      height: 220px;
    }

    .actions-description {
      margin: 0;
      font-size: ${theme.fonts.base};
      color: ${theme.colors.white};
    }

    .actions-balance {
      margin: 0;
      font-size: ${theme.fonts.xl};
      color: ${theme.colors.white};
    }

    .actions-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

      & > button {
        height: 35px;
        width: 120px;
      }
    }
  `}
`;
