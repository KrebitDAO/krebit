import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  isHidden: boolean;
  currentFilterOption: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, isHidden, currentFilterOption }) => css`
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

    .person-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .person-header-text-container {
        display: flex;
        align-items: center;

        .person-header-text {
          margin: 0;
          font-size: ${theme.fonts.lg};
          color: ${theme.colors.white};
        }

        .person-header-text-open-new {
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

      .person-header-verify {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        background-color: ${theme.colors.brightGray};
        border-radius: 20px;
        padding: 6px 10px;
        cursor: pointer;
      }
    }

    .cards-box {
      display: grid;
      grid-gap: 17px;

      @media (min-width: ${theme.screens.lg}) {
        ${currentFilterOption === 'personhood' &&
        css`
          grid-template-columns: repeat(2, auto);
        `}
      }
    }
  `}
`;
