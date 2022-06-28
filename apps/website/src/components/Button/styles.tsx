// Code reference: https://codepen.io/christianjbolus/pen/yLzPvwO
import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface Props {
  primaryColor: string;
  secondaryColor: string;
  data: string;
}

export const Wrapper = styled.button<Props>`
  ${({ theme, primaryColor, secondaryColor }) => css`
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    border-radius: 29px;
    background: linear-gradient(
      to right,
      ${theme.colors[primaryColor]},
      ${theme.colors[secondaryColor]}
    );
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      left: 1px;
      right: 1px;
      top: 1px;
      bottom: 1px;
      border-radius: 29px;
      background-color: ${theme.colors.white};
      z-index: -1;
      transition: all 0.2s ease;
    }

    &::after {
      content: attr(data);
      font-size: ${theme.fonts.base};
      background: linear-gradient(
        to right,
        ${theme.colors[primaryColor]},
        ${theme.colors[secondaryColor]}
      );
      -webkit-background-clip: text;
      color: ${theme.colors.transparent};
      transition: all 0.2s ease;
    }

    &:hover::before {
      opacity: 50%;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
    }

    &:hover::after {
      color: ${theme.colors.white};
    }
  `}
`;
