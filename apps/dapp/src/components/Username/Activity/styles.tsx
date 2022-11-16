import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  isHidden: boolean;
  isEmpty?: boolean;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, isHidden, isEmpty }) => css`
    display: ${isEmpty ? 'none' : 'block'};
    transition: all 0.2s ease;
    margin-top: 32px;

    ${isHidden &&
    css`
      height: 0;
      opacity: 0;
      margin: 0;
      visibility: hidden;
    `}

    @media (min-width: ${theme.screens.lg}) {
      margin-top: 36px;

      ${isHidden &&
      css`
        margin: 0;
      `}
    }

    .activity-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .activity-header-text {
        margin: 0;
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
      }

      .activity-header-text-open-new {
        width: 15px;
        height: 15px;
        cursor: pointer;
        margin-left: 10px;

        & > svg {
          width: 15px;
          height: 15px;
          fill: ${theme.colors.white};
        }
      }
    }

    .activity-cards {
      display: grid;
      grid-gap: 10px;

      .timestamp {
        margin: 0;
        color: ${theme.colors.white}80;
        font-size: ${theme.fonts.xs};
      }

      .activity-card-loading {
        width: 100%;
        height: 148px;
      }
    }
  `}
`;
