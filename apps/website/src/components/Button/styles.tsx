// Code reference: https://codepen.io/christianjbolus/pen/yLzPvwO
import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface Props {
  primaryColor: string;
  secondaryColor: string;
  hasTransparency?: boolean;
}

export const Wrapper = styled.button<Props>`
  ${({ theme, primaryColor, secondaryColor, hasTransparency }) => css`
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    border-radius: 29px;
    background: linear-gradient(
      to right,
      ${theme.colors[primaryColor]}${hasTransparency ? '80' : 'FF'},
      ${theme.colors[secondaryColor]}${hasTransparency ? '80' : 'FF'}
    );
    cursor: pointer;
    font-family: 'HelveticaNowDisplay-Medium';
    font-size: ${theme.fonts.base};
    color: ${theme.colors.white};
  `}
`;
