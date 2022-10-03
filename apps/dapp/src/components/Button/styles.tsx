// Code reference: https://codepen.io/christianjbolus/pen/yLzPvwO
import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface Props {
  styleType: string;
  primaryColor: string;
  secondaryColor: string;
  borderBackgroundColor: string;
  hasIcon: boolean;
}

export const Wrapper = styled.button<Props>`
  ${({
    theme,
    styleType,
    primaryColor,
    secondaryColor,
    borderBackgroundColor,
    hasIcon
  }) => css`
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    border-radius: 29px;
    font-family: 'HelveticaNowDisplay-Medium';
    font-size: ${theme.fonts.sm};
    cursor: pointer;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    ${hasIcon &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;

      & > svg {
        width: 24px;
        height: 24px;
        fill: ${theme.colors.cyan};

        & > g > path {
          fill: ${theme.colors.cyan};
        }
      }
    `}

    ${styleType === 'background' &&
    css`
      background: linear-gradient(
        to right,
        ${theme.colors[primaryColor]},
        ${theme.colors[secondaryColor]}
      );
      color: ${theme.colors.haiti};
    `}

    ${styleType === 'border' || styleType == 'border-rounded'
      ? css`
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
            border-radius: ${styleType == 'border-rounded' ? '9999px' : '29px'};
            background-color: ${theme.colors[borderBackgroundColor]};
            z-index: -1;
          }
        `
      : null}
  `}
`;
