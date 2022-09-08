import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    .messages-header {
      padding: 0 20px;

      .messages-header-title {
        margin: 20px 0;
        text-align: center;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          margin: 20px 0;
          margin-top: 60px;
          font-size: ${theme.fonts.xl};
        }
      }

      .messages-header-button {
        margin: 0 auto;
        width: 170px;
        height: 49px;

        @media (min-width: ${theme.screens.lg}) {
          width: 211px;
          height: 58px;
        }
      }
    }
  `}
`;

export const LoadingWrapper = styled.div`
  ${({ theme }) => css`
    margin-top: 20px;

    .button {
      margin: 0 auto;
      width: 170px;
      height: 49px;

      @media (min-width: ${theme.screens.lg}) {
        width: 211px;
        height: 58px;
      }
    }
  `}
`;
