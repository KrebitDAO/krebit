import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.ebonyClay};
    padding: 10px;
    border-radius: 10px;
    border: 1px solid ${theme.colors.scorpion}80;
    position: relative;

    .help-tooltip-header {
      position: relative;
      top: 0;
      right: 0;
      left: 0;

      .help-tooltip-header-close {
        margin-left: auto;
        width: 25px;
        height: 25px;
        cursor: pointer;

        & > svg {
          width: 25px;
          height: 25px;
          fill: ${theme.colors.white};
        }
      }
    }

    .help-tooltip-title {
      margin: 20px 5px;
      color: ${theme.colors.white};
      font-size: ${theme.fonts.lg};
      font-weight: bold;

      @media (min-width: ${theme.screens.lg}) {
        margin: 30px;
        font-size: ${theme.fonts.xl};
        font-weight: bold;
      }
    }

    .help-tooltip-content {
      margin: 20px 5px;
      color: ${theme.colors.white};
      font-size: ${theme.fonts.base};

      @media (min-width: ${theme.screens.lg}) {
        margin: 30px;
        font-size: ${theme.fonts.lg};
      }
    }

    .help-tooltip-footer {
      display: flex;
      justify-content: space-between;
    }

    .help-tooltip-button {
      border: none;
      outline: none;
      width: 80px;
      height: 30px;
      border-radius: 29px;
      font-family: 'HelveticaNowDisplay-Medium';
      font-size: ${theme.fonts.sm};
      cursor: pointer;
    }

    .help-tooltip-button.background {
      background: linear-gradient(
        to right,
        ${theme.colors.heliotrope},
        ${theme.colors.cyan}
      );
      color: ${theme.colors.haiti};
      margin-left: auto;
    }

    .help-tooltip-button.border {
      background: linear-gradient(
        to left,
        ${theme.colors.heliotrope},
        ${theme.colors.cyan}
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
        background-color: ${theme.colors.ebonyClay};
        z-index: -1;
      }
    }
  `}
`;
