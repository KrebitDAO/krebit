import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 30;
    width: 100vw;
    height: 100vh;
    background-color: ${theme.colors.white}0D;
    backdrop-filter: saturate(180%) blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;

    .question-modal-container {
      background-color: ${theme.colors.bunting};
      border-radius: 15px;
      box-shadow: ${theme.shadows.smallest};
      padding: 36px 28px;
      width: 577px;

      .question-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .question-modal-header-title {
          margin: 0;
          font-size: ${theme.fonts.xl};
          color: ${theme.colors.white};
        }

        .question-modal-header-close {
          cursor: pointer;
          float: right;

          & > svg {
            fill: ${theme.colors.white};
            width: 24px;
            height: 24px;
          }
        }
      }

      .question-modal-content {
        margin: 20px 0;

        .question-modal-content-text {
          margin: 0;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white}B3;
        }
      }

      .question-modal-content-buttons {
        display: flex;
        grid-gap: 8px;
        justify-content: flex-end;

        .question-modal-content-button {
          width: 146px;
          height: 50px;
        }
      }
    }
  `}
`;
