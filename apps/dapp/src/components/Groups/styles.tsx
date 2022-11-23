import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  image?: string;
  isFilterOpen?: boolean;
  replyToImage?: string;
  hasCommentSelected?: boolean;
  isReplyToOpen?: boolean;
  isReply?: boolean;
  type?: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, image, isFilterOpen }) => css`
    max-width: 1238px;
    margin: 0 auto;
    padding: 0 20px;

    @media (min-width: ${theme.screens.xl}) {
      display: grid;
      grid-template-columns: 240px auto 360px;
      grid-gap: 20px;
      padding: 0;
      margin-top: 65px;
    }

    @media (min-width: ${theme.screens['2xl']}) {
      max-width: 1306px;
    }

    .timestamp {
      margin: 0;
      margin-left: 5px;
      color: ${theme.colors.white}80;
      font-size: ${theme.fonts.xs};
    }

    .view-more {
      margin: 0;
      color: ${theme.colors.rose};
      font-size: ${theme.fonts.xs};
      font-family: 'HelveticaNowDisplay-Medium';
      cursor: pointer;
    }

    .left-box-loading {
      display: none;

      @media (min-width: ${theme.screens.xl}) {
        display: block;
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
          justify-content: end;

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

        .left-box-title {
          margin: 10px 0;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.xl};
          color: ${theme.colors.white};
          text-align: center;
        }

        .left-box-description {
          margin: 0;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white}80;
          text-align: center;
        }

        .left-box-list {
          border-top: 1px solid ${theme.colors.white}33;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          grid-gap: 10px;

          & > :first-of-type {
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

    .content-loading-card {
      height: 50px;
      width: 50px;
      margin: 30px auto;
    }

    .content-loadmore-button {
      width: 100px;
      height: 30px;
      margin: 20px auto;
    }

    .content-box-input {
      width: 100%;
      min-height: 100px;
      border-radius: 5px;
      background-color: ${theme.colors.ebonyClay};
      padding: 15px;
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
        resize: none;

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

    .content-box-refresh-button {
      background: linear-gradient(
        to right,
        ${theme.colors.heliotrope},
        ${theme.colors.cyan}
      );
      border: none;
      outline: none;
      border-radius: 5px;
      width: 100px;
      height: 26px;
      cursor: pointer;
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      & > svg {
        width: 20px;
        height: 20px;
        fill: ${theme.colors.haiti};
        margin-right: 5px;
      }

      & > span {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.haiti};
      }
    }

    .content {
      overflow-y: auto;
      height: 100vh;

      @media (min-width: ${theme.screens.xl}) {
        padding-right: 5px;
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

      .content-box-list {
        display: grid;
        grid-gap: 10px;
        margin-top: 20px;
        margin-bottom: 135px;

        @media (min-width: ${theme.screens.lg}) {
          margin-bottom: 100px;
        }
      }
    }

    .content-chat {
      height: calc(100vh - 100px);
      width: 100%;
      border: 1px solid ${theme.colors.ebonyClay};
      border-radius: 10px;
      padding: 10px;
      position: relative;

      .content-box-list {
        display: flex;
        flex-direction: column-reverse;
        height: calc(100% - 139px);
        overflow-y: auto;
      }

      .content-box-list.content-box-list-bigger {
        height: calc(100% - 179px);
      }

      .content-box-chat {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        padding: 10px;
        background-color: ${theme.colors.ebony};
        border-top: 1px solid ${theme.colors.ebonyClay};
      }
    }

    .right-box-loading {
      display: none;

      @media (min-width: ${theme.screens.xl}) {
        display: block;
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

export const RightBoxItem = styled.a<IProps>`
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
      background-color: ${theme.colors.ebony};
      border: 1px solid ${theme.colors.white};
    }

    .right-box-item-content {
      .right-box-item-content-title {
        margin: 0;
        margin-bottom: 3px;
        font-size: ${theme.fonts.sm};
        font-family: 'HelveticaNowDisplay-Medium';
        color: ${theme.colors.white};
      }

      .right-box-item-content-boxes {
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
  `}
`;

export const ContentCard = styled.div<IProps>`
  ${({ theme, image, replyToImage, type = 'feed' }) => css`
    padding: ${type === 'chat' ? '10px 0' : '15px'};
    background-color: ${type === 'chat' ? 'initial' : theme.colors.ebonyClay};
    border-radius: ${type === 'chat' ? 0 : '10px'};
    border-top: ${type === 'chat'
      ? `1px solid ${theme.colors.white}33`
      : 'initial'};

    .content-card-reply-to {
      display: flex;

      .content-card-reply-to-icon {
        border-top: 2px solid ${theme.colors.gray};
        border-left: 2px solid ${theme.colors.gray};
        border-radius: 6px 0 0 0;
        width: 15px;
        height: 25px;
        display: flex;
        align-self: flex-end;
        margin-left: 19px;
      }

      .content-card-reply-to-main {
        display: flex;
        margin-bottom: 5px;
        width: 100%;
        opacity: 0.7;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }

        .content-card-reply-to-main-image {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          margin-right: 7px;
          background-image: url('${replyToImage}');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-color: ${theme.colors.ebony};
          border: 1px solid ${theme.colors.white};

          @media (min-width: ${theme.screens.lg}) {
            width: 45px;
          }
        }

        .content-card-reply-to-main-texts {
          display: flex;
          align-items: center;

          .content-card-reply-to-main-texts-title {
            margin: 0;
            font-size: ${theme.fonts.sm};
            font-family: 'HelveticaNowDisplay-Medium';
            color: ${theme.colors.white};
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 200px;

            @media (min-width: ${theme.screens.lg}) {
              width: 540px;
            }

            & > span {
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.white}80;

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts.base};
              }
            }
          }
        }
      }
    }

    .content-card-main {
      display: flex;

      .content-card-image {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        background-image: url('${image}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: ${theme.colors.ebony};
        border: 1px solid ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          width: 45px;
        }
      }

      .content-card-information {
        margin-left: 7px;
        display: table;
        table-layout: fixed;
        width: 100%;
        word-wrap: break-word;

        .content-card-information-title {
          cursor: pointer;

          & > span {
            margin: 0;
            font-size: ${theme.fonts.sm};
            font-family: 'HelveticaNowDisplay-Medium';
            color: ${theme.colors.white};
            display: flex;
            align-items: center;

            & > svg {
              width: 15px;
              height: 15px;
              fill: ${theme.colors.white}80;
              margin-left: 5px;
            }
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
              background-color: ${type === 'chat'
                ? theme.colors.ebonyClay
                : theme.colors.ebony};
            }
          }
        }

        .content-card-information-header {
          display: flex;
          justify-content: space-between;
          position: relative;

          .content-card-information-options {
            display: flex;
            align-items: center;
            grid-gap: 10px;
            background-color: ${theme.colors.ebonyClay};
            padding: 0 5px;
            margin-right: 10px;
            height: 30px;
            box-shadow: ${theme.shadows.small};
            border-radius: 10px;
            cursor: pointer;

            .content-card-information-option {
              width: 20px;
              height: 20px;

              & > svg,
              & > img {
                width: 20px;
                height: 20px;
                fill: ${theme.colors.white}80;

                & > path {
                  fill: ${theme.colors.white}80;
                }
              }
            }

            .content-card-information-option.revert {
              & > svg,
              & > img {
                transform: rotate(90deg);
              }
            }
          }

          .content-card-information-options-dropdown {
            position: absolute;
            bottom: 46px;
            right: 56px;
            z-index: 10;
          }
        }

        .content-card-information-description {
          margin: 10px 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};

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

        .content-card-information-actions {
          display: flex;
          justify-content: space-between;
          position: relative;

          .content-card-information-action {
            display: flex;
            grid-gap: 10px;
          }

          .content-card-information-action-option {
            display: flex;
            align-items: center;
            grid-gap: 3px;
            cursor: pointer;

            & > svg,
            & > img {
              width: 20px;
              height: 20px;
              fill: ${theme.colors.white}80;

              & > path {
                fill: ${theme.colors.white}80;
              }
            }

            & > span {
              margin: 0;
              font-size: ${theme.fonts.xs};
              color: ${theme.colors.white}80;
            }
          }

          .content-card-information-action-option.active {
            & > svg {
              fill: ${theme.colors.cyan};

              & > path {
                fill: ${theme.colors.cyan};
              }
            }

            & > span {
              color: ${theme.colors.cyan};
            }
          }

          .content-card-information-action-dropdown {
            position: absolute;
            top: 16px;
            right: 50px;
            z-index: 10;
          }
        }
      }
    }
  `}
`;

export const CommentBox = styled.div<IProps>`
  ${({ theme, hasCommentSelected, isReplyToOpen }) => css`
    visibility: ${hasCommentSelected ? 'initial' : 'hidden'};
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 20;

    .comment-background {
      width: 100%;
      height: 100%;
      background-color: ${theme.colors.white}0D;
      backdrop-filter: saturate(180%) blur(20px);
    }

    .comment-box {
      height: 100%;
      width: 100%;
      max-width: 670px;
      position: absolute;
      right: ${hasCommentSelected ? 0 : '-670px'};
      top: 0;
      background-color: ${theme.colors.ebonyClay};
      transition: 0.5s;

      .comment-box-loading {
        height: 50px;
        width: 50px;
        margin: 30px auto;
      }

      .comment-box-header {
        display: flex;
        justify-content: space-between;
        padding: 20px;

        .comment-box-header-title {
          margin: 0;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
        }

        .comment-box-header-icon {
          width: 20px;
          height: 20px;

          & > svg {
            width: 20px;
            height: 20px;
            fill: ${theme.colors.white};
          }
        }
      }

      .comment-box-cards {
        height: ${isReplyToOpen ? 'calc(100% - 250px)' : 'calc(100% - 220px)'};
        padding: 0 20px;
        overflow-y: scroll;
        overflow-x: hidden;

        & > hr {
          width: 100%;
          margin: 20px 0;
          border: none;
          border-top: 1px solid ${theme.colors.gray}80;
        }
      }

      .comment-box-input-container {
        border-top: 1px solid ${theme.colors.gray}80;
        background-color: ${theme.colors.ebonyClay};
        padding: 20px;
        padding-top: ${isReplyToOpen ? '10px' : '20px'};
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;

        .comment-box-input {
          width: 100%;
          min-height: 100px;
          border-radius: 5px;
          background-color: ${theme.colors.brightGray};
          padding: 15px;
          display: flex;
          flex-direction: column;

          .comment-box-input-element {
            outline: none;
            border: none;
            background-color: ${theme.colors.brightGray};
            width: auto !important;
            max-height: 150px;
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.gray};
            resize: none;

            @media (min-width: ${theme.screens.xl}) {
              font-size: ${theme.fonts.base};
            }

            &::placeholder {
              color: ${theme.colors.gray}80;
            }
          }

          .comment-box-input-button {
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
      }
    }
  `}
`;

export const CommentBoxCard = styled.div<IProps>`
  ${({ theme, image, isReply }) => css`
    display: flex;
    margin-bottom: 20px;

    .comment-box-image {
      width: ${isReply ? '45px' : '50px'};
      height: ${isReply ? '45px' : '50px'};
      border: 1px solid ${theme.colors.white};
      border-radius: 9999px;
      background-image: url('${image}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;

      @media (min-width: ${theme.screens.lg}) {
        width: ${isReply ? '50px' : '55px'};
        height: ${isReply ? '45px' : '50px'};
      }
    }

    .comment-span-box {
      margin-top: 10px;
      margin-right: 5px;
      border: 1px solid ${theme.colors.melrose};
      border-radius: 20px;
      padding: 4px 14px;
      height: 33px;
      width: fit-content;
      cursor: pointer;
      display: flex;
      align-items: center;
      cursor: pointer;

      .comment-span-box-close {
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

      .comment-span-box-text {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.melrose};
        max-width: 240px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .comment-box-information {
      margin-left: 7px;
      display: table;
      table-layout: fixed;
      width: 100%;
      word-wrap: break-word;

      .comment-box-information-title {
        cursor: pointer;

        & > span {
          margin: 0;
          font-size: ${theme.fonts.sm};
          font-family: 'HelveticaNowDisplay-Medium';
          color: ${theme.colors.white};

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${isReply ? theme.fonts.sm : theme.fonts.base};
          }
        }

        .timestamp {
          margin: 0;
          margin-left: 5px;
          color: ${theme.colors.white}80;
          font-size: ${theme.fonts.xs};
        }

        .comment-box-information-title-boxes {
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

      .comment-box-information-job {
        .comment-box-information-job-image {
          width: fit-content;
          height: 80px;
        }

        .comment-box-information-job-title {
          margin: 0;
          margin-top: 10px;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.xl};
          color: ${theme.colors.white};
        }

        .comment-box-information-job-subtitle {
          margin: 0;
          margin-top: 10px;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white};
        }

        .comment-box-information-job-text {
          margin: 0;
          margin-top: 10px;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};

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

        .comment-box-information-job-list {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
        }

        .comment-box-information-job-buttons {
          display: flex;
          grid-gap: 10px;
          margin: 20px 0;

          .comment-box-information-job-button {
            width: 124px;
            height: 30px;
          }
        }
      }

      .comment-box-information-description {
        margin: 10px 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};

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

      .comment-box-information-actions {
        display: flex;
        justify-content: space-between;
        position: relative;

        .comment-box-information-action {
          display: flex;
          grid-gap: 10px;
        }

        .comment-box-information-action-option {
          display: flex;
          align-items: center;
          grid-gap: 3px;
          cursor: pointer;

          & > svg,
          & > img {
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

        .comment-box-information-action-option.active {
          & > svg {
            fill: ${theme.colors.cyan};
          }

          & > span {
            color: ${theme.colors.cyan};
          }
        }

        .comment-box-information-options-dropdown {
          position: absolute;
          bottom: 10px;
          right: 50px;
          z-index: 10;
        }
      }
    }
  `}
`;

export const ContentBoxChatReplyTo = styled.div<IProps>`
  ${({ theme, replyToImage }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .content-box-chat-reply-to-info {
      display: flex;
      align-items: center;

      .content-box-chat-reply-to-text {
        margin: 0;
        margin-right: 10px;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white}80;
      }

      .content-box-chat-reply-to-image {
        width: 30px;
        height: 30px;
        border-radius: 9999px;
        border: 1px solid ${theme.colors.white};
        background-image: url('${replyToImage}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        margin-right: 10px;
      }

      .content-box-chat-reply-to-title {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
      }
    }

    .content-box-chat-reply-to-close {
      width: 20px;
      height: 20px;
      cursor: pointer;

      & > svg {
        width: 20px;
        height: 20px;
        fill: ${theme.colors.white};
      }
    }
  `}
`;
