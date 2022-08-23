import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    width: 178px;
    padding: 16px;
    background-color: ${theme.colors.brightGray};
    box-shadow: ${theme.shadows.smallest};
    border-radius: 10px;
    font-size: ${theme.fonts.xs};
    color: ${theme.colors.white};
  `}
`;
