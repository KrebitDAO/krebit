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

    .share-with-modal-container {
      width: 500px;
      height: 700px;
      box-shadow: ${theme.shadows.small};

      .lsm-back-button:hover {
        background-color: var(--lsm-background-color) !important;
      }

      .lsm-next-button,
      .lsm-confirmation-modal-button-yes,
      .lsm-delete-modal-button-yes {
        background-color: var(--lsm-background-color) !important;
        border: 1px solid ${theme.colors.white} !important;
      }
    }
  `}
`;
