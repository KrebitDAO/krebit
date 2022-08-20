import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    position: relative;
    width: 100px;
    height: 100px;
    margin: 0 auto;

    .bx {
      position: relative;
      width: 100px;
      height: 100px;
      animation: spinner_green 1s linear infinite;
    }

    .spinner {
      width: 100px;
      height: 100px;
      border: 10px solid ${theme.colors.periwinkle};
      border-radius: 9999px;
      box-sizing: border-box;
    }

    .line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .line circle {
      animation: line_green 1s linear infinite;
    }

    @keyframes spinner_green {
      0% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(320deg);
      }
      100% {
        transform: rotate(720deg);
      }
    }

    @keyframes line_green {
      0% {
        stroke-dasharray: 0 250;
      }

      50% {
        stroke-dasharray: 218.75 250;
      }

      100% {
        stroke-dasharray: 0 250;
      }
    }
  `}
`;
