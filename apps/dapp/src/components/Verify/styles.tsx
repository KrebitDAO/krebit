import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
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
      padding: 36px 20px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      overflow-y: auto;

      @media (min-width: ${theme.screens.lg}) {
        height: auto;
        max-height: 98%;
        width: 577px;
        border-radius: 15px;
        padding: 36px 30px;
      }

      .verify-box-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 37px;

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
        justify-content: space-between;

        .verify-steps-line {
          flex: 1;
          height: 1px;
          border: 1px solid ${theme.colors.gray};
        }

        .verify-step {
          .verify-step-indicator {
            padding: 5px;
            border-radius: 9999px;
            background-color: ${theme.colors.white};
            margin: 0;
            color: ${theme.colors.bunting};
            font-size: ${theme.fonts.sm};
          }

          .verify-step-text {
            margin: 0;
            color: ${theme.colors.white};
            font-size: ${theme.fonts.sm};
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
