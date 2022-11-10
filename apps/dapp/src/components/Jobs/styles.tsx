import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  image: string;
  isFilterOpen?: boolean;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, image, isFilterOpen }) => css`
    max-width: 1306px;
    margin: 0 auto;
    padding: 0 20px;

    @media (min-width: ${theme.screens.xl}) {
      display: grid;
      grid-template-columns: 240px auto 360px;
      grid-gap: 20px;
      padding: 0;
      margin-top: 65px;
    }

    .left-box-loading {
      display: none;

      @media (min-width: ${theme.screens.xl}) {
        width: 240px;
        max-height: calc(100vh - 100px);
      }
    }

    .left-box-background {
      visibility: ${isFilterOpen ? 'initial' : 'hidden'};
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: ${theme.colors.white}0D;
      backdrop-filter: saturate(180%) blur(20px);
      z-index: 20;

      @media (min-width: ${theme.screens.xl}) {
        visibility: initial;
        position: initial;
        width: initial;
        height: initial;
        background-color: initial;
        backdrop-filter: initial;
        z-index: initial;
      }

      .left-box {
        background-color: ${theme.colors.ebonyClay};
        width: 100%;
        max-height: 544px;
        padding: 20px;
        position: absolute;
        bottom: ${isFilterOpen ? 0 : '-544px'};
        border-radius: 10px 10px 0px 0px;
        box-shadow: ${theme.shadows.small};
        overflow-y: auto;
        overflow-x: hidden;
        transition: 0.5s;

        @media (min-width: ${theme.screens.xl}) {
          width: 240px;
          max-height: calc(100vh - 100px);
          position: initial;
          bottom: initial;
          border-radius: 10px;
          overflow-y: auto;
        }

        .left-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .left-box-header-icon {
            width: 20px;
            height: 20px;

            & > svg {
              width: 20px;
              height: 20px;
              fill: ${theme.colors.white};
            }

            @media (min-width: ${theme.screens.xl}) {
              display: none;
            }
          }
        }

        .left-box-text {
          margin: 0;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.xs};
          color: ${theme.colors.white}80;
        }

        .left-box-image {
          width: 100px;
          height: 100px;
          border-radius: 9999px;
          background-image: url('${image}');
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          margin: 10px auto;
        }

        .left-box-title {
          margin: 10px 0;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.xl};
          color: ${theme.colors.white};
        }

        .left-box-description {
          margin: 0;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white}80;
        }

        .left-box-list {
          border-top: 1px solid ${theme.colors.white}33;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          grid-gap: 10px;

          & > :first-child {
            padding-top: 10px;
          }

          .left-box-list-option {
            display: flex;
            align-items: center;
            cursor: pointer;

            .left-box-list-option-icon {
              width: 20px;
              height: 20px;
              margin-right: 5px;

              & > svg {
                width: 20px;
                height: 20px;
                fill: ${theme.colors.white}80;

                & > g > path {
                  fill: ${theme.colors.white}80;
                }
              }
            }

            .left-box-list-option-text {
              margin: 0;
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.white}80;
            }
          }

          .left-box-list-option.active {
            .left-box-list-option-icon {
              & > svg {
                fill: ${theme.colors.white};

                & > g > path {
                  fill: ${theme.colors.white};
                }
              }
            }

            .left-box-list-option-text {
              font-family: 'HelveticaNowDisplay-Medium';
              color: ${theme.colors.white};
            }
          }
        }
      }
    }

    .content {
      overflow-y: auto;
      height: 100vh;

      @media (min-width: ${theme.screens.xl}) {
        padding-right: 5px;
      }

      .content-loading-card {
        height: 200px;
        margin: 10px;
      }

      .content-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        .content-header-title {
          margin: 0;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white};
        }

        .content-header-icon {
          width: 24px;
          height: 24px;

          & > svg {
            width: 24px;
            height: 24px;
            fill: ${theme.colors.white};
          }

          @media (min-width: ${theme.screens.xl}) {
            display: none;
          }
        }
      }

      .content-box-input {
        width: 100%;
        min-height: 100px;
        border-radius: 5px;
        background-color: ${theme.colors.ebonyClay};
        padding: 10px;
        display: flex;
        flex-direction: column;

        .content-box-input-element {
          outline: none;
          border: none;
          background-color: ${theme.colors.ebonyClay};
          width: auto !important;
          max-height: 150px;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.gray};

          @media (min-width: ${theme.screens.xl}) {
            font-size: ${theme.fonts.base};
          }

          &::placeholder {
            color: ${theme.colors.gray}80;
          }
        }

        .content-box-input-button {
          background: linear-gradient(
            to right,
            ${theme.colors.heliotrope},
            ${theme.colors.cyan}
          );
          color: ${theme.colors.haiti};
          border: none;
          outline: none;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.sm};
          border-radius: 5px;
          width: 70px;
          height: 26px;
          cursor: pointer;
          align-self: flex-end;
          margin-top: 10px;

          &:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        }
      }

      .content-box-list {
        display: grid;
        grid-gap: 10px;
        margin-top: 20px;
        margin-bottom: 100px;
      }
    }

    .right-box-loading {
      display: none;

      @media (min-width: ${theme.screens.xl}) {
        width: 360px;
        max-height: calc(100vh - 100px);
      }
    }

    .right-box {
      display: none;
      padding: 20px;
      width: 360px;
      background-color: ${theme.colors.ebonyClay};
      border-radius: 10px;
      box-shadow: ${theme.shadows.small};
      max-height: calc(100vh - 100px);
      overflow-y: auto;

      @media (min-width: ${theme.screens.xl}) {
        display: block;
      }

      .right-box-text {
        margin: 0;
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.xs};
        color: ${theme.colors.white}80;
      }

      .right-box-list {
        margin-top: 10px;
      }
    }
  `}
`;

export const RightBoxItem = styled.div<IProps>`
  ${({ theme, image }) => css`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;

    .right-box-item-image {
      width: 40px;
      height: 40px;
      border-radius: 9999px;
      margin-right: 7px;
      background-image: url('${image}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .right-box-item-content {
      .right-box-item-content-title {
        margin: 0;
        margin-bottom: 3px;
        font-size: ${theme.fonts.sm};
        font-family: 'HelveticaNowDisplay-Medium';
        color: ${theme.colors.white};
      }

      .right-box-item-content-box {
        margin: 0;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: ${theme.fonts.xs};
        color: ${theme.colors.white};
        background-color: ${theme.colors.ebony};
      }
    }
  `}
`;

export const ContentCard = styled.div<IProps>`
  ${({ theme, image }) => css`
    padding: 10px;
    background-color: ${theme.colors.ebonyClay};
    border-radius: 10px;
    display: flex;
    width: fit-content;

    .content-card-image {
      width: 40px;
      height: 40px;
      border-radius: 9999px;
      margin-right: 7px;
      background-image: url('${image}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .content-card-information {
      margin-left: 7px;
      display: table;
      table-layout: fixed;
      width: 100%;
      word-wrap: break-word;

      .content-card-information-title {
        & > span {
          margin: 0;
          font-size: ${theme.fonts.sm};
          font-family: 'HelveticaNowDisplay-Medium';
          color: ${theme.colors.white};
        }

        .content-card-information-title-boxes {
          display: flex;
          flex-wrap: wrap;
          grid-gap: 5px;
          margin-top: 5px;

          & > span {
            margin: 0;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white};
            background-color: ${theme.colors.ebony};
          }
        }
      }

      .content-card-information-description {
        margin: 10px 0;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};
      }

      .content-card-information-actions {
        display: flex;
        justify-content: space-between;

        .content-card-information-action {
          display: flex;
          grid-gap: 10px;
        }

        .content-card-information-action-option {
          display: flex;
          align-items: center;
          grid-gap: 3px;
          cursor: pointer;

          & > svg {
            width: 20px;
            height: 20px;
            fill: ${theme.colors.white}80;
          }

          & > span {
            margin: 0;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white}80;
          }
        }
      }
    }
  `}
`;
