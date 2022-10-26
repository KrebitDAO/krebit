import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  color?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, color, iconColor, onClick }) => css`
    width: 100%;
    height: 100%;
    position: relative;
    cursor: ${onClick ? 'pointer' : 'initial'};

    & > .badge-text {
      position: absolute;
      top: 0px;
      right: 0px;
      transform: scale(1) translate(50%, -50%);
      transform-origin: 100% 0%;
      margin: 0;
      color: ${theme.colors.white};
      font-family: 'HelveticaNowDisplay-Medium';
      font-size: ${theme.fonts.xs};
      padding: 0 6px;
      background-color: ${theme.colors[color]};
      border-radius: 10px;
      height: 20px;
      min-width: 20px;
      width: fit-content;
      box-sizing: border-box;
    }

    & > svg {
      width: 100%;
      height: 100%;
      fill: ${theme.colors[iconColor]};

      & > g > path {
        fill: ${theme.colors[iconColor]};
      }
    }
  `}
`;
