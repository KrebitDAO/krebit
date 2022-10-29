import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    max-width: 1474px;
    margin: 0 auto;

    .main {
      padding: 123px 20px;

      .main-title {
        font-size: ${theme.fonts['5xl']};
        font-family: 'HelveticaNowDisplay-Bold';
        color: ${theme.colors.white};
        line-height: 1.1;
        margin: 0;
        padding-bottom: 30px;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts['7xl']};
        }
      }

      .main-subtitle {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.xl};
        color: ${theme.colors.white};
        margin: 0;
        padding-top: 30px;
        padding-bottom: 20px;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts['3xl']};
        }
      }

      .main-text {
        margin: 0;
        color: ${theme.colors.white};
        font-size: ${theme.fonts.base};
      }
    }
  `}
`;
