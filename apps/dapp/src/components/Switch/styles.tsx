import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    .MuiTypography-root {
      color: ${theme.colors.white};
      font-family: 'HelveticaNowDisplay-Regular';
      font-size: ${theme.fonts.base};
    }

    .Mui-disabled {
      color: ${theme.colors.white} !important;
    }

    & .MuiSwitch-switchBase.Mui-checked {
      color: ${theme.colors.cyan};
    }

    .MuiSwitch-track,
    & .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
      background-color: ${theme.colors.white};
    }
  `}
`;
