import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    display: none;

    @media (min-width: ${theme.screens.lg}) {
      display: block;
    }

    padding: 16px;
    background-color: ${theme.colors.brightGray};
    box-shadow: ${theme.shadows.small};
    position: absolute;
    top: 60px;
    right: 0;
    border-radius: 15px;
    z-index: 10;

    .share-content-title {
      margin: 0;
      font-family: 'HelveticaNowDisplay-Bold';
      font-size: ${theme.fonts.xl};
      color: ${theme.colors.white};
      text-align: center;
    }

    .share-content-container {
      margin-top: 15px;
      display: grid;
      grid-template-columns: repeat(5, auto);
      grid-gap: 8px;

      .share-content-container-element {
        width: 62px;
        cursor: pointer;

        .share-content-container-icon {
          border: 1px solid ${theme.colors.white}26;
          border-radius: 14px;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;

          & > svg {
            width: 22px;
            height: 22px;
            fill: ${theme.colors.white};

            & > path {
              fill: ${theme.colors.white};
            }
          }
        }

        .share-content-container-element-text {
          margin: 0;
          margin-top: 5px;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
          text-align: center;
        }
      }
    }
  `}
`;
