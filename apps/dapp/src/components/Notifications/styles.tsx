import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  isNotificationsOpen?: boolean;
  image?: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, isNotificationsOpen }) => css`
    visibility: ${isNotificationsOpen ? 'initial' : 'hidden'};
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 20;

    .notifications-background {
      width: 100%;
      height: 100%;
      background-color: ${theme.colors.white}0D;
      backdrop-filter: saturate(180%) blur(20px);
    }

    .notifications-box {
      height: 100%;
      width: 100%;
      max-width: 670px;
      position: absolute;
      right: ${isNotificationsOpen ? 0 : '-670px'};
      top: 0;
      background-color: ${theme.colors.ebonyClay};
      transition: 0.5s;
      overflow-y: auto;

      .notifications-box-loading {
        height: 50px;
        width: 50px;
        margin: 30px auto;
      }

      .notifications-box-header {
        display: flex;
        justify-content: space-between;
        padding: 20px;

        .notifications-box-header-title {
          margin: 0;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
        }

        .notifications-box-header-icon {
          width: 20px;
          height: 20px;
          cursor: pointer;

          & > svg {
            width: 20px;
            height: 20px;
            fill: ${theme.colors.white};
          }
        }
      }
    }

    .notifications-divider {
      width: 100%;
      border: none;
      border-top: 1px solid ${theme.colors.gray}80;
    }

    .notifications-child-card {
      cursor: pointer;
      margin: 10px;
      padding: 12px;
      background-color: ${theme.colors.ebony};
      border-radius: 14px;

      & > div {
        padding: 0;
      }
    }
  `}
`;

export const NotificationsCard = styled.div<IProps>`
  ${({ theme, image }) => css`
    display: flex;
    padding: 0 20px;

    .notifications-card-image {
      width: 50px;
      height: 40px;
      border: 1px solid ${theme.colors.white};
      border-radius: 9999px;
      background-image: url('${image}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;

      @media (min-width: ${theme.screens.lg}) {
        width: 52px;
        height: 48px;
      }
    }

    .notifications-card-content {
      margin-left: 7px;
      display: table;
      table-layout: fixed;
      width: 100%;
      word-wrap: break-word;
      align-self: center;

      .notifications-card-content-title {
        cursor: pointer;

        & > span {
          margin: 0;
          font-size: ${theme.fonts.sm};
          font-family: 'HelveticaNowDisplay-Medium';
          color: ${theme.colors.white};

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.base};
          }
        }

        .notifications-card-content-subtitle {
          margin: 0;
          margin-left: 5px;
          color: ${theme.colors.white}80;
          font-size: ${theme.fonts.sm};
        }
      }

      .notifications-card-content-description {
        margin: 0;
        margin-top: 10px;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.base};
        }
      }
    }
  `}
`;
