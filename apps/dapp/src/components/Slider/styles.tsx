import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    height: 100%;
    width: 100%;

    .MuiSlider-root {
      padding: 0;
      color: ${theme.colors.melrose};
    }

    .MuiSlider-valueLabel {
      background-color: ${theme.colors.brightGray};
      color: ${theme.colors.white};
    }
  `}
`;
