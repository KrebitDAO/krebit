import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  image?: string;
  length?: number;
  hasSpecialSpace?: boolean;
  isActive?: boolean;
  hasConversations?: boolean;
}

export const LoadingWrapper = styled.div`
  ${({ theme }) => css`
    margin: 0 auto;
    margin-top: 20px;
    width: 50px;
    height: 50px;
  `}
`;

export const Wrapper = styled.div<IProps>`
  ${({ theme, hasConversations = true }) => css`
    margin: 0 auto;
    padding: 0 20px;
    margin-bottom: 100px;
    max-width: 1238px;
    --width: calc(25px * ${length} + 9px);

    @media (min-width: ${theme.screens.lg}) {
      padding: 0;
      margin: 0 auto;
      margin-bottom: 76px;

      ${hasConversations &&
      css`
        margin-top: 50px;
        display: grid;
        grid-template-columns: 430px auto;
        grid-gap: 24px;
      `}
    }

    .not-messages {
      height: calc(100vh - 56px);
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      grid-gap: 32px;

      .not-messages-image {
        width: 167px;
        height: 33px;

        @media (min-width: ${theme.screens.lg}) {
          width: 259px;
          height: 52px;
        }
      }

      .not-messages-title {
        margin: 0;
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts['2xl']};
        }
      }

      .not-messages-button {
        width: 142px;
        height: 50px;
      }
    }

    .messages-is-hidden {
      display: none;

      @media (min-width: ${theme.screens.lg}) {
        display: block;
      }
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
          cursor: pointer;

          @media (min-width: ${theme.screens.lg}) {
            width: 25px;
            height: 25px;
          }

          & > svg {
            width: 20px;
            height: 20px;
            fill: ${theme.colors.white};

            @media (min-width: ${theme.screens.lg}) {
              width: 25px;
              height: 25px;
            }
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
        border: 1px solid ${theme.colors.white}80;

        @media (min-width: ${theme.screens.lg}) {
          max-height: calc(100vh - 121px);
          overflow-y: auto;
          overflow-x: hidden;
        }
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

          @media (min-width: ${theme.screens.lg}) {
            display: none;
          }
        }
      }

      .messages-right-side-chat-box {
        position: relative;
        height: calc(100vh - 130px);

        .messages-right-side-box {
          background-color: ${theme.colors.ebonyClay};
          border-radius: 14px;
          border: 1px solid ${theme.colors.white}80;
          padding: 16px 20px;
          margin-top: 10px;
          height: calc(100% - 67px);
          display: flex;
          grid-gap: 14px;
          flex-direction: column-reverse;
          overflow-y: auto;
        }

        .messages-right-box-chat {
          position: absolute;
          right: 0;
          left: 0;
          bottom: 0;
          height: 55px;
          margin-top: 12px;
          width: 100%;
          border: 1px solid ${theme.colors.white}80;
          background-color: ${theme.colors.ebonyClay};
          border-radius: 14px;
          display: flex;
          align-items: center;
          padding: 5px;

          & > input {
            width: calc(100% - 50px);
            height: 100%;
            border: none;
            outline: none;
            background-color: ${theme.colors.ebonyClay};
            border-radius: 14px;
            color: ${theme.colors.white};
            font-size: ${theme.fonts.sm};

            &:disabled {
              opacity: 0.5;
            }

            &::placeholder {
              color: ${theme.colors.white}80;
            }
          }

          & > button {
            width: 50px;
            height: 48px;
            border-radius: 9999px;
            border: none;
            outline: none;
            background: linear-gradient(
              to right,
              ${theme.colors.heliotrope},
              ${theme.colors.cyan}
            );
            display: flex;
            justify-content: center;
            align-items: center;

            & > svg {
              width: 18px;
              height: 18px;
              fill: ${theme.colors.blueCharcoal};
            }

            &:disabled {
              opacity: 0.5;
            }
          }
        }
      }
    }
  `}
`;

export const MessagesBoxItem = styled.div<IProps>`
  ${({ theme, length, hasSpecialSpace = true, isActive }) => css`
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
      color: ${isActive ? theme.colors.cyan : theme.colors.white};
      font-size: ${theme.fonts.base};
      width: calc(80% - var(--width) - ${hasSpecialSpace ? '60px' : '0px'});
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: ${isActive ? 'underline' : 'initial'};

      @media (min-width: ${theme.screens.lg}) {
        width: calc(100% - var(--width) - ${hasSpecialSpace ? '60px' : '0px'});
      }
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

export const MessagesRightSideBoxMessage = styled.div<IProps>`
  ${({ theme, image }) => css`
    display: flex;

    .messages-right-side-box-item-image {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      background-image: url('${image}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 9999px;
    }

    .messages-right-side-box-item {
      max-width: 500px;
      width: calc(100% - 50px);
      margin: 0;
      padding: 12px 20px;
      border-radius: 14px;
      background-color: ${theme.colors.ebony};
      color: ${theme.colors.white};
      font-size: ${theme.fonts.sm};
      word-wrap: break-word;

      & > a {
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.cyan};
      }

      @media (min-width: ${theme.screens.lg}) {
        font-size: ${theme.fonts.base};

        & > a {
          font-size: ${theme.fonts.base};
        }
      }
    }

    .messages-right-side-box-item-me {
      width: 100%;
      background-color: ${theme.colors.electricViolet};
      margin: 0;
      margin-left: 30px;

      @media (min-width: ${theme.screens.lg}) {
        margin-left: auto;
      }
    }
  `}
`;

export const ConversationAutocompleteBox = styled.div`
  ${({ theme }) => css`
    width: 100%;

    .conversation-autocomplete-boxes {
      display: flex;
      flex-wrap: nowrap;

      .conversation-autocomplete-box {
        margin-top: 10px;
        border: 1px solid ${theme.colors.melrose};
        border-radius: 20px;
        padding: 4px 14px;
        height: 33px;
        width: fit-content;
        cursor: pointer;
        display: flex;
        align-items: center;
        cursor: pointer;

        .conversation-autocomplete-box-close {
          margin-right: 5px;
          width: 15px;
          height: 15px;
          background-color: ${theme.colors.melrose};
          border-radius: 9999px;
          display: flex;
          justify-content: center;
          align-items: center;

          & > svg {
            width: 10px;
            height: 10px;
            fill: ${theme.colors.ebony};
          }
        }

        .conversation-autocomplete-box-text {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.melrose};
        }
      }
    }
  `}
`;
