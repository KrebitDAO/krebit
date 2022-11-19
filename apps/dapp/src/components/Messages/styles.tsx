import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  image?: string;
  length?: number;
  hasSpecialSpace?: boolean;
}

export const LoadingWrapper = styled.div`
  ${({ theme }) => css`
    margin: 0 auto;
    margin-top: 20px;
    width: 50px;
    height: 50px;
  `}
`;

export const Wrapper = styled.div`
  ${({ theme }) => css`
    margin: 0 auto;
    margin-bottom: 100px;
    --width: calc(25px * ${length} + 9px);

    @media (min-width: ${theme.screens.lg}) {
      float: right;
      margin-right: 80px;
      margin-top: 65px;
      margin-bottom: 76px;
      display: grid;
      grid-template-columns: 266px 922px;
      grid-gap: 48px;
    }

    @media (min-width: ${theme.screens['2xl']}) {
      float: initial;
      margin: 0 auto;
      margin-top: 65px;
      margin-bottom: 76px;
      max-width: 1306px;
      grid-template-columns: auto 922px;
    }

    .messages-is-hidden {
      display: none;

      @media (min-width: ${theme.screens.lg}) {
        display: block;
      }
    }

    .messages-container {
      padding: 0 20px;
      padding-top: 16px;

      @media (min-width: ${theme.screens.lg}) {
        padding: 0;
      }

      .messages-left-side {
        .messages-left-side-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .messages-left-side-header-text {
            margin: 0;
            color: ${theme.colors.white};
            font-family: 'HelveticaNowDisplay-Medium';
            font-size: ${theme.fonts.base};
          }

          .messages-left-side-header-icon {
            width: 20px;
            height: 20px;

            & > svg {
              width: 20px;
              height: 20px;
              fill: ${theme.colors.white};
            }
          }
        }

        .messages-left-side-box {
          background-color: ${theme.colors.ebonyClay};
          border-radius: 14px;
          box-shadow: ${theme.shadows.small};
          padding: 16px 20px;
          margin-top: 10px;
          display: grid;
          grid-gap: 22px;
        }
      }

      .messages-right-side {
        .messages-right-side-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .messages-right-side-header-icon {
            width: 24px;
            height: 24px;
            transform: rotate(180deg);

            & > svg {
              width: 24px;
              height: 24px;
              fill: ${theme.colors.white};
            }
          }
        }

        .messages-right-side-chat-box {
          position: relative;
          height: calc(100vh - 130px);

          .messages-right-side-box {
            background-color: ${theme.colors.ebonyClay};
            border-radius: 14px;
            box-shadow: ${theme.shadows.small};
            padding: 16px 20px;
            margin-top: 10px;
            height: calc(100% - 67px);
            display: flex;
            grid-gap: 14px;
            flex-direction: column-reverse;
            overflow-y: auto;

            .messages-right-side-box-item {
              margin: 0;
              margin-right: 30px;
              padding: 12px 20px;
              border-radius: 14px;
              background-color: ${theme.colors.ebony};
              color: ${theme.colors.white};
            }

            .messages-right-side-box-item-me {
              background-color: ${theme.colors.electricViolet};
              margin: 0;
              margin-left: 30px;
            }
          }

          .messages-right-box-chat {
            position: absolute;
            right: 0;
            left: 0;
            bottom: 0;
            height: 55px;
            margin-top: 12px;
          }
        }
      }
    }
  `}
`;

export const MessagesBoxItem = styled.div<IProps>`
  ${({ theme, length, hasSpecialSpace = true }) => css`
    --width: calc(25px * ${length} + 9px);
    display: flex;
    align-items: center;
    cursor: pointer;

    .messages-box-item-images {
      position: relative;
      width: var(--width);
      height: 34px;
    }

    .messages-box-item-text {
      margin: 0;
      margin-left: 10px;
      color: ${theme.colors.white};
      font-size: ${theme.fonts.base};
      width: calc(100% - var(--width) - ${hasSpecialSpace ? '60px' : '0px'});
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:hover {
      .messages-box-item-text {
        text-decoration: underline;
      }
    }
  `}
`;

export const MessagesBoxItemImage = styled.div<IProps>`
  ${({ theme, image, length }) => css`
    width: 34px;
    height: 34px;
    border-radius: 9999px;
    background-image: url('${image}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    left: ${length === 0 ? 0 : `calc(25px * ${length})`};
    z-index: ${length === 0 ? 0 : `calc(1 * ${length})`};
  `}
`;
