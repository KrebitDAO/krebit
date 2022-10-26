import { css } from '@emotion/react';
import styled from '@emotion/styled';

import MaterialMenuItem from '@mui/material/MenuItem';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 100%;

    label {
      color: ${theme.colors.white}B3;
      font-family: 'HelveticaNowDisplay-Medium';
    }

    label.Mui-focused {
      color: ${theme.colors.white}B3;
    }

    .MuiOutlinedInput-notchedOutline,
    .Mui-focused .MuiOutlinedInput-notchedOutline,
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: ${theme.colors.white}B3 !important;
    }

    .MuiSelect-selectMenu {
      font-family: 'HelveticaNowDisplay-Regular';
      white-space: initial;
    }

    .MuiInputBase-root:hover {
      border: none;
    }

    .MuiSvgIcon-root {
      fill: ${theme.colors.white}B3;
    }

    .MuiSelect-select {
      color: ${theme.colors.white}B3;
    }
  `}
`;

export const MenuItem = styled(MaterialMenuItem)`
  &.MuiMenuItem-root {
    font-family: 'HelveticaNowDisplay-Regular';
  }
`;
