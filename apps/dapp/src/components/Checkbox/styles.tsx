import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const CheckboxWrapper = styled.div`
  ${({ theme }) => css`
    .MuiCheckbox-root,
    .MuiCheckbox-root.Mui-checked {
      color: ${theme.colors.white};
    }

    .MuiFormControlLabel-root > .MuiTypography-root {
      color: ${theme.colors.white};
      font-family: 'HelveticaNowDisplay-Regular';
    }
  `}
`;
