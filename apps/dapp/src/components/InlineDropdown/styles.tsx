import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    width: 180px;
    background-color: ${theme.colors.brightGray};
    box-shadow: ${theme.shadows.smallest};
    border-radius: 10px;
    padding: 12px 6px;
    z-index: 10;

    .inline-dropdown-item {
      width: 100%;
      padding: 6px;
      margin: 0;
      border: none;
      background-color: ${theme.colors.brightGray};
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white};
      text-align: initial;
      cursor: pointer;

      &:hover {
        background-color: ${theme.colors.white}1A;
        border-radius: 5px;
      }
    }
  `}
`;
