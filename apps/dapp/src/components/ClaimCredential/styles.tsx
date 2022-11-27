import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    margin-top: 123px;

    .claim-loading {
      width: 60px;
      height: 60px;
      margin: 0 auto;
    }

    .claim-error {
      margin: 0;
      font-family: 'HelveticaNowDisplay-Bold';
      font-size: ${theme.fonts.lg};
      color: ${theme.colors.white};
      text-align: center;
    }
  `}
`;
