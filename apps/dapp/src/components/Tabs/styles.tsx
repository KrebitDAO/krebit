import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const TabsWrapper = styled.div`
  ${({ theme }) => css`
    margin-top: 10px;

    .MuiTab-root {
      color: ${theme.colors.white};
    }

    .Mui-selected {
      color: ${theme.colors.cyan} !important;
    }

    .MuiTabs-indicator {
      background-color: ${theme.colors.cyan} !important;
    }

    .Mui-disabled {
      color: current !important;
      -webkit-text-fill-color: ${theme.colors.white} !important;
    }
  `}
`;
