import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const CheckboxWrapper = styled.div`
  ${({ theme }) => css`
    .MuiFormControlLabel-root {
      margin: 0;
    }

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
