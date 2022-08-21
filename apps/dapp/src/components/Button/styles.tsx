// Code reference: https://codepen.io/christianjbolus/pen/yLzPvwO
import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface Props {
  styleType: string;
  primaryColor: string;
  secondaryColor: string;
}

export const Wrapper = styled.button<Props>`
  ${({ theme, styleType, primaryColor, secondaryColor }) => css`
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    border-radius: 29px;
    font-family: 'HelveticaNowDisplay-Medium';
    font-size: ${theme.fonts.base};
    cursor: pointer;

    ${styleType === 'background' &&
      css`
        background: linear-gradient(
          to right,
          ${theme.colors[primaryColor]},
          ${theme.colors[secondaryColor]}
        );
        color: ${theme.colors.haiti};
      `}

    ${styleType === 'border' &&
      css`
        background: linear-gradient(
          to left,
          ${theme.colors[primaryColor]},
          ${theme.colors[secondaryColor]}
        );
        color: ${theme.colors.cyan};
        position: relative;
        z-index: 1;

        &::before {
          content: '';
          position: absolute;
          left: 1px;
          right: 1px;
          top: 1px;
          bottom: 1px;
          border-radius: 29px;
          background-color: ${theme.colors.blueCharcoal};
          z-index: -1;
        }
      `}
  `}
`;
