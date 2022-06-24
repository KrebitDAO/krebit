import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    max-width: 1474px;
    margin: 0 auto;

    /* .body-ellipse-5 {
      background-image: url('/imgs/backgrounds/Ellipse_5.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      width: 100%;
      height: 654.68px;
      left: -137px;
      top: 271.85px;
      background-color: #ff0087;
      filter: blur(100px);
      transform: rotate(-15deg);
      z-index: 0;
    }

    .body-ellipse-6 {
      background-image: url('/imgs/backgrounds/Ellipse_6.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      width: 100%;
      height: 650px;
      left: -248px;
      top: -53px;
      background-color: #00fffe;
      filter: blur(100px);

      z-index: 0;
    }

    .body-ellipse-12 {
      background-image: url('/imgs/backgrounds/Ellipse_12.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      width: 100%;
      height: 399px;
      left: 0;
      top: -162px;
      background-color: #f1f6fa;
      filter: blur(100px);
      z-index: 0;
    } */

    .main {
      min-height: 100vh;
      height: 100%;

      @media (min-width: ${theme.screens.lg}) {
        display: grid;
        grid-gap: 64px;
        grid-template-columns: 563px 848px;
      }

      .main-content {
        padding: 0 20px;
        padding-top: 126px;
        z-index: 200;
        align-self: center;

        @media (min-width: ${theme.screens.lg}) {
          padding: 0;
        }

        .main-title {
          font-size: ${theme.fonts['5xl']};
          font-family: 'HelveticaNowDisplay-Medium';
          color: ${theme.colors.bunting};
          position: relative;
          z-index: 10;
          line-height: 1.2;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts['7xl']};
          }
        }

        .main-description {
          margin: 0;
          margin-top: 5px;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.bunting};
          position: relative;
          z-index: 10;

          @media (min-width: ${theme.screens.lg}) {
            margin-top: 24px;
            font-size: ${theme.fonts.lg};
          }
        }

        .main-buttons {
          display: flex;
          grid-gap: 20px;
          justify-content: center;
          padding-top: 32px;

          @media (min-width: ${theme.screens.lg}) {
            grid-gap: 36px;
            justify-content: initial;
            padding-top: 68px;
          }

          .main-button {
            width: 170px;
            height: 49px;

            @media (min-width: ${theme.screens.lg}) {
              width: 211px;
              height: 58px;
            }
          }

          .main-line-button {
            cursor: pointer;
            display: flex;
            align-items: center;
            grid-gap: 5px;

            & > svg {
              width: 20px;
              height: 20px;
              fill: ${theme.colors.bunting};
            }

            .main-line-button-text {
              font-family: 'HelveticaNowDisplay-Medium';
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.bunting};

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts.base};
              }
            }
          }
        }
      }

      .main-content-image {
        position: absolute;
        bottom: 0;
        background-image: url('/imgs/images/home.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 377px;

        @media (min-width: ${theme.screens.lg}) {
          position: initial;
          height: 100%;
          width: 100%;
        }
      }
    }

    .decentralized {
      margin-top: 75px;

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 150px;
      }

      .decentralized-title {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts['4xl']};
        color: ${theme.colors.bunting};
        margin: 0 20px;
        margin-bottom: 75px;
        max-width: 901px;
        text-align: center;

        @media (min-width: ${theme.screens.lg}) {
          margin: 0 auto;
          margin-bottom: 150px;
          font-size: ${theme.fonts['6xl']};
        }
      }
    }
  `}
`;
