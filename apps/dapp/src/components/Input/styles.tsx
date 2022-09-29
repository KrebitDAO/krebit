import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const InputWrapper = styled.div`
  ${({ theme }) => css`
    height: 100%;
    width: 100%;

    & > .MuiFormControl-root {
      height: 100% !important;
      width: 100% !important;
    }

    label {
      color: ${theme.colors.white}B3;
      font-family: 'HelveticaNowDisplay-Regular';
    }

    label.Mui-focused {
      color: ${theme.colors.white}B3;
    }

    & .MuiInput-underline:after {
      border-bottom-color: ${theme.colors.white}B3;
    }

    .MuiInputBase-input {
      font-family: 'HelveticaNowDisplay-Regular';
      color: ${theme.colors.white}B3;
    }

    .MuiOutlinedInput-root {
      fieldset {
        border-color: ${theme.colors.white}B3 !important;
      }

      &:hover fieldset {
        border-color: ${theme.colors.white}B3;
      }

      &.Mui-focused fieldset {
        border-color: ${theme.colors.white}B3;
      }
    }

    .Mui-disabled {
      color: ${theme.colors.white}B3 !important;
      -webkit-text-fill-color: ${theme.colors.white}B3 !important;
    }
  `}
`;
