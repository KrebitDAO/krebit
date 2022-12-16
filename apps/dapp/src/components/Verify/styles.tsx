import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  viewStatus?: string;
  stepsWidth?: number | string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, viewStatus, stepsWidth = 577 }) => css`
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 20;
    width: 100vw;
    height: 100vh;
    background-color: ${theme.colors.white}0D;
    backdrop-filter: saturate(180%) blur(20px);
    display: flex;
    align-items: center;
    justify-content: center;

    .verify-box {
      background-color: ${theme.colors.bunting};
      box-shadow: ${theme.shadows.smallest};
      padding: 20px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      overflow-y: auto;

      @media (min-width: ${theme.screens.lg}) {
        height: 100%;
        max-height: 601px;
        overflow: ${viewStatus === 'steps' ? 'hidden' : 'auto'};
        width: ${stepsWidth}px;
        border-radius: 15px;
        padding: 36px 30px;
        position: relative;
      }

      .verify-box-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;

        .verify-box-header-content {
          display: flex;
          align-items: center;

          .verify-box-header-content-icon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            transform: rotate(180deg);
            cursor: pointer;

            & > svg {
              width: 24px;
              height: 24px;
              fill: ${theme.colors.white};
            }
          }

          .verify-box-header-content-title {
            margin: 0;
            font-family: 'HelveticaNowDisplay-Medium';
            font-size: ${theme.fonts.lg};
            color: ${theme.colors.white};
            align-self: center;
          }
        }

        .verify-box-header-close {
          width: 24px;
          height: 24px;
          cursor: pointer;

          & > svg {
            width: 24px;
            height: 24px;
            fill: ${theme.colors.white};
          }
        }
      }

      .verify-box-list {
        display: grid;
        grid-gap: 20px;

        @media (min-width: ${theme.screens.lg}) {
          grid-gap: 28px;
        }

        .verify-box-item {
          display: flex;
          justify-content: space-between;

          .verify-box-item-content {
            display: flex;
            align-items: center;

            .verify-box-item-content-icon {
              width: 24px;
              height: 24px;
              margin-right: 6px;

              @media (min-width: ${theme.screens.lg}) {
                width: 31px;
                height: 31px;
              }

              & > svg {
                width: 24px;
                height: 24px;
                fill: ${theme.colors.white}CC;

                @media (min-width: ${theme.screens.lg}) {
                  width: 31px;
                  height: 31px;
                }
              }
            }

            .verify-box-item-content-text {
              margin: 0;
              font-size: ${theme.fonts.base};
              color: ${theme.colors.white}CC;

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts.xl};
              }
            }
          }

          .verify-box-item-button {
            width: 65px;
            height: 38px;

            @media (min-width: ${theme.screens.lg}) {
              width: 85px;
            }
          }
        }
      }

      .verify-steps-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .verify-steps-line {
          display: none;

          @media (min-width: ${theme.screens.lg}) {
            display: block;
            margin: 0 5px;
            flex: 1;
            height: 1px;
            border: 1px solid ${theme.colors.gray};
          }
        }

        .verify-step {
          display: none;

          @media (min-width: ${theme.screens.lg}) {
            display: flex;
          }

          .verify-step-indicator {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            border-radius: 9999px;
            background-color: ${theme.colors.white};
            margin: 0;
            color: ${theme.colors.bunting};
            font-family: 'HelveticaNowDisplay-Medium';
            font-size: ${theme.fonts.sm};
            margin-right: 5px;
          }

          .verify-step-indicator.active {
            background-color: ${theme.colors.cyan};
          }

          .verify-step-text {
            margin: 0;
            color: ${theme.colors.white};
            font-family: 'HelveticaNowDisplay-Medium';
            font-size: ${theme.fonts.sm};
          }
        }

        .verify-step.active {
          display: flex;
        }
      }

      .verify-steps-container {
        height: 80%;
        overflow-y: auto;
        padding-bottom: 60px;

        @media (min-width: ${theme.screens.lg}) {
          height: 450px;
        }

        .verify-steps-content {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .verify-steps-content-title {
          margin: 0;
          margin-bottom: 20px;
          font-size: ${theme.fonts.base};
          font-family: 'HelveticaNowDisplay-Medium';
          color: ${theme.colors.white};
        }

        .verify-steps-content-description {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white}B3;
        }

        .verify-steps-content-dots {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-decoration: underline;
        }

        .verify-steps-content-icon {
          margin-left: 20px;
          margin-bottom: 20px;

          & > svg {
            width: 30px;
            height: 30px;
            fill: ${theme.colors.white};
          }
        }

        .verify-steps-content-list {
          margin: 24px 0;
          padding: 0;
          padding-inline-start: 20px;
        }

        .verify-steps-content-credential {
          margin-top: 10px;

          .verify-steps-content-card {
            min-height: 230px;
            height: 100%;

            @media (min-width: ${theme.screens.lg}) {
              width: 500px;
            }
          }

          .verify-steps-content-dates {
            display: flex;
            grid-gap: 14px;
            margin-top: 20px;

            .verify-steps-content-date {
              .verify-steps-content-date-title {
                margin: 0;
                font-size: ${theme.fonts.sm};
                color: ${theme.colors.white}B3;
              }

              .verify-steps-content-date-text {
                margin: 0;
                font-size: ${theme.fonts.sm};
                color: ${theme.colors.white};
                font-family: 'HelveticaNowDisplay-Medium';
              }
            }
          }

          .verify-steps-content-visibility-container {
            display: flex;
            align-items: center;
            grid-gap: 5px;

            .verify-steps-content-visibility {
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

          .verify-steps-content-external-urls {
            display: flex;
            grid-gap: 10px;
            margin-top: 20px;

            & > img {
              cursor: pointer;
            }
          }

          .verify-steps-content-skills {
            display: flex;
            flex-wrap: wrap;
            grid-gap: 8px;
            margin-top: 20px;

            .verify-steps-content-skill {
              border: 1px solid ${theme.colors.melrose};
              border-radius: 20px;
              padding: 4px 14px;
              height: 100%;
              width: fit-content;

              .verify-steps-content-skill-text {
                margin: 0;
                font-size: ${theme.fonts.xs};
                color: ${theme.colors.melrose};

                @media (min-width: ${theme.screens.lg}) {
                  font-size: ${theme.fonts.sm};
                }
              }
            }
          }
        }

        .verify-steps-content-fields {
          display: grid;
          grid-gap: 24px;
          margin-top: 24px;

          @media (min-width: ${theme.screens.lg}) {
            margin: 24px 0;
          }
        }

        .verify-steps-loading {
          display: flex;
          flex-direction: column;
          align-items: center;

          .verify-steps-loading-box {
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
          }

          .verify-steps-loading-text {
            margin: 0 auto;
            font-size: ${theme.fonts.base};
            color: ${theme.colors.white}B3;
            text-align: center;
          }
        }

        .verify-steps-error {
          margin: 0 auto;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.pomegranate}B3;
          text-align: center;
        }

        .verify-steps-completed {
          margin-top: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;

          .verify-steps-completed-title {
            margin: 0;
            margin-bottom: 20px;
            font-size: ${theme.fonts['2xl']};
            color: ${theme.colors.white};
          }

          .verify-steps-completed-button {
            width: 150px;
            height: 40px;
          }
        }
      }

      .verify-steps-bottom {
        display: flex;
        justify-content: space-between;
        position: absolute;
        position: absolute;
        left: 30px;
        right: 30px;
        bottom: 35px;
        background-color: ${theme.colors.bunting};

        .verify-steps-bottom-button {
          margin-top: 10px;
          width: 130px;
          height: 40px;

          @media (min-width: ${theme.screens.lg}) {
            width: 150px;
          }
        }
      }
    }
  `}
`;

export const BoxStepWrapper = styled.div`
  ${({ theme }) => css`
    width: 100%;
    padding: 20px;
    border-radius: 15px;
    border: 1px solid ${theme.colors.white}4D;

    @media (min-width: ${theme.screens.lg}) {
      padding: 22px;
    }

    .verify-box-loading {
      margin: 0;
      font-size: ${theme.fonts.base};
      color: ${theme.colors.white}B3;
      text-align: center;
    }

    .verify-box-error {
      margin: 0;
      font-size: ${theme.fonts.base};
      color: ${theme.colors.pomegranate}B3;
      text-align: center;
    }

    .verify-box-step-content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .verify-box-step-content-title {
        margin: 0;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white}B3;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.xl};
        }
      }
    }

    .verify-box-step-content-description {
      margin: 0;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white}B3;

      @media (min-width: ${theme.screens.lg}) {
        font-size: ${theme.fonts.base};
      }
    }

    .verify-box-step-content-dots {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: underline;
    }

    .verify-box-step-content-icon {
      margin-left: 20px;

      & > svg {
        width: 30px;
        height: 30px;
        fill: ${theme.colors.white};
      }
    }

    .verify-box-step-content-list {
      margin: 0;
      margin-top: 24px;
      padding: 0;
      padding-inline-start: 20px;
    }

    .verify-box-step-fields {
      display: grid;
      grid-gap: 24px;
      margin-top: 24px;

      @media (min-width: ${theme.screens.lg}) {
        margin: 24px 0;
      }
    }

    .verify-box-step-button {
      width: 85px;
      height: 38px;
      margin-top: 24px;
      float: right;
    }
  `}
`;
