import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  isFilterOpen: boolean;
}

interface ICardProps {
  picture: string;
  profilePicture?: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, isFilterOpen }) => css`
    margin: 0 auto;
    margin-bottom: 100px;

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

    .filter-menu-background {
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

      @media (min-width: ${theme.screens.lg}) {
        visibility: initial;
        position: initial;
        width: initial;
        height: initial;
        background-color: initial;
        backdrop-filter: initial;
        z-index: initial;
      }

      .filter-menu-header-desktop {
        display: none;

        @media (min-width: ${theme.screens.lg}) {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .filter-menu-header-desktop-title {
          margin: 0;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white};
          font-family: 'HelveticaNowDisplay-Medium';
        }

        .filter-menu-header-desktop-clear {
          display: flex;
          align-items: center;
          grid-gap: 7px;
          cursor: pointer;

          .filter-menu-header-desktop-clear-icon {
            width: 20px;
            height: 20px;

            & > svg {
              fill: ${theme.colors.white};
              width: 20px;
              height: 20px;
            }
          }

          .filter-menu-header-desktop-clear-text {
            font-family: 'HelveticaNowDisplay-Medium';
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.white};
            margin: 0;
            text-decoration: underline;
          }
        }
      }
    }

    .explorer-container {
      padding: 0 20px;
      padding-top: 16px;

      @media (min-width: ${theme.screens.lg}) {
        padding: 0;
      }

      .explorer-header {
        display: flex;
        justify-content: space-between;

        .explorer-header-title {
          margin: 0;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white};

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.xl};
          }

          .explorer-header-span {
            display: none;

            @media (min-width: ${theme.screens.lg}) {
              display: initial;
              font-family: 'HelveticaNowDisplay-Regular';
              font-size: ${theme.fonts.base};
              color: ${theme.colors.gray};
            }
          }
        }

        .explorer-header-icon {
          width: 24px;
          height: 24px;

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

      .explorer-searcher {
        width: 100%;
        height: 48px;
        margin-top: 13px;
        background-color: ${theme.colors.ebonyClay};
        border: 1px solid ${theme.colors.scorpion}80;
        border-radius: 10px;
        display: flex;
        align-items: center;

        .explorer-searcher-icon {
          width: 20px;
          height: 20px;
          margin: 0 15px;

          & > svg {
            width: 20px;
            height: 20px;
            fill: ${theme.colors.gray};
          }
        }

        .explorer-searcher-icon-white {
          cursor: pointer;

          & > svg {
            fill: ${theme.colors.white};
          }
        }

        & > input {
          outline: none;
          border: none;
          border-radius: 10px;
          background-color: ${theme.colors.ebonyClay};
          width: 100%;
          height: 100%;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.gray};

          &::placeholder {
            color: ${theme.colors.gray}80;
          }
        }
      }

      .explorer-card-loading {
        width: 100%;
        height: 222px;

        @media (min-width: ${theme.screens.lg}) {
          height: 383px;
        }
      }

      .explorer-cards {
        margin-top: 22px;
        display: grid;
        grid-template-columns: repeat(2, minmax(auto, 0.5fr));
        grid-gap: 12px;

        @media (min-width: ${theme.screens.lg}) {
          grid-template-columns: repeat(3, minmax(auto, 0.5fr));
          grid-gap: 26px;
        }
      }

      .explorer-cards-services {
        margin-top: 22px;
        display: grid;
        grid-gap: 12px;

        @media (min-width: ${theme.screens.lg}) {
          grid-template-columns: repeat(3, minmax(auto, 0.5fr));
          grid-gap: 26px;
        }
      }

      .explore-card-not-found {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
        margin: 0;
        margin-top: 20px;
        text-align: center;
      }

      .explorer-cards-button {
        width: 94px;
        height: 28px;
        margin: 0 auto;
        margin-top: 20px;

        @media (min-width: ${theme.screens.lg}) {
          width: 144px;
          height: 44px;
        }
      }
    }
  `}
`;

export const FilterMenu = styled.div<IProps>`
  ${({ theme, isFilterOpen }) => css`
    background-color: ${theme.colors.ebonyClay};
    width: 100%;
    max-height: 544px;
    padding: 30px 22px;
    padding-top: 0;
    position: absolute;
    bottom: ${isFilterOpen ? 0 : '-544px'};
    border-radius: 10px 10px 0px 0px;
    box-shadow: ${theme.shadows.small};
    overflow-y: auto;
    overflow-x: hidden;
    transition: 0.5s;

    @media (min-width: ${theme.screens.lg}) {
      max-height: 600px;
      position: initial;
      bottom: initial;
      border-radius: 15px;
      padding: 30px 22px;
    }

    .filter-menu-header {
      display: flex;
      justify-content: space-between;
      position: sticky;
      top: 0;
      padding: 30px 0;
      background-color: ${theme.colors.ebonyClay};

      @media (min-width: ${theme.screens.lg}) {
        display: none;
      }

      .filter-menu-header-text {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
        margin: 0;
      }

      .filter-menu-header-close {
        width: 24px;
        height: 24px;

        & > svg {
          fill: ${theme.colors.white};
          width: 24px;
          height: 24px;
        }
      }
    }

    .filter-menu-clear {
      display: flex;
      align-items: center;
      grid-gap: 7px;
      margin-bottom: 33px;

      @media (min-width: ${theme.screens.lg}) {
        display: none;
      }

      .filter-menu-clear-icon {
        width: 20px;
        height: 20px;

        & > svg {
          fill: ${theme.colors.white};
          width: 20px;
          height: 20px;
        }
      }

      .filter-menu-clear-text {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        margin: 0;
        text-decoration: underline;
      }
    }

    .filter-menu-skills {
      .filter-menu-skills-loading {
        width: 60px;
        height: 60px;
        margin: 0 auto;
      }

      .filter-menu-no-skills {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        margin: 0;
        text-align: center;
      }

      .filter-menu-skills-text {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        margin: 0;
        margin-bottom: 15px;
      }

      .filter-menu-skills-list {
        display: flex;
        flex-wrap: wrap;
        grid-gap: 8px;

        .filter-menu-skills-item {
          border: 1px solid ${theme.colors.melrose};
          border-radius: 20px;
          padding: 4px 14px;
          height: 100%;
          width: fit-content;
          cursor: pointer;

          .filter-menu-skills-item-text {
            margin: 0;
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.melrose};
          }
        }

        .filter-menu-skills-item-active {
          background-color: ${theme.colors.melrose};

          .filter-menu-skills-item-text {
            color: ${theme.colors.white};
          }
        }
      }

      .filter-menu-skills-view-more {
        padding: 26px 0;
        margin: 0;
        text-align: center;
        color: ${theme.colors.cyan};
        font-size: ${theme.fonts.sm};
        text-decoration: underline;
        border-bottom: 1px solid ${theme.colors.gray};
        cursor: pointer;

        @media (min-width: ${theme.screens.lg}) {
          padding-top: 32px;
          padding-bottom: 41px;
        }
      }
    }

    .filter-menu-slider {
      margin-top: 35px;

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 41px;
      }

      .filter-menu-slider-text {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        margin: 0;
        margin-bottom: 20px;
      }
    }

    .filter-menu-slider-bottom {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;

      .filter-menu-slider-bottom-text {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
      }
    }

    .filter-menu-button {
      margin-top: 57px;
      height: 44px;

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 41px;
      }
    }
  `}
`;

export const ProfileCard = styled.a<ICardProps>`
  ${({ theme, picture }) => css`
    width: 100%;
    background-color: ${theme.colors.ebonyClay};
    border: 1px solid ${theme.colors.scorpion}80;
    border-radius: 15px;
    padding: 12px 0;
    cursor: pointer;

    @media (min-width: ${theme.screens.lg}) {
      padding: 32px 0;
    }

    .explorer-card-picture {
      width: 52px;
      height: 52px;
      border-radius: 9999px;
      border: 2px solid ${theme.colors.white};
      background-image: url('${picture}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      margin: 0 auto;

      @media (min-width: ${theme.screens.lg}) {
        width: 108px;
        height: 108px;
      }
    }

    .explorer-card-title {
      text-align: center;
      margin: 0 auto;
      margin-top: 10px;
      margin-bottom: 2px;
      color: ${theme.colors.white};
      font-family: 'HelveticaNowDisplay-Medium';
      font-size: ${theme.fonts.sm};
      max-width: 140px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 24px;
        font-size: ${theme.fonts.lg};
        max-width: 270px;
      }
    }

    .explorer-card-description {
      text-align: center;
      margin: 0;
      font-size: ${theme.fonts.xs};
      color: ${theme.colors.cyan};

      @media (min-width: ${theme.screens.lg}) {
        font-size: ${theme.fonts.sm};
        margin-bottom: 18px;
      }
    }

    .explorer-card-followers {
      text-align: center;
      margin-bottom: 18px;

      @media (min-width: ${theme.screens.lg}) {
        margin-bottom: 50px;
      }

      .explorer-card-follow {
        margin: 0;
        font-size: ${theme.fonts.xs};
        color: ${theme.colors.white};
        text-decoration: underline;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.sm};
        }

        .explorer-card-follow-text {
          color: ${theme.colors.white}B3;
        }
      }

      .explorer-card-follow-dot {
        display: inline-block;
        margin: 0 8px;
        width: 3px;
        height: 3px;
        background-color: ${theme.colors.alto};
        border-radius: 9999px;
      }
    }

    .explorer-card-button {
      width: 94px;
      height: 28px;
      margin: 0 auto;

      @media (min-width: ${theme.screens.lg}) {
        width: 144px;
        height: 44px;
      }
    }
  `}
`;

export const ServiceCard = styled.a<ICardProps>`
  ${({ theme, picture, profilePicture }) => css`
    width: 100%;
    background-color: ${theme.colors.ebonyClay};
    border: 1px solid ${theme.colors.scorpion}80;
    border-radius: 15px;
    cursor: pointer;

    .explore-service-picture {
      width: 100%;
      height: 200px;
      background-image: url('${picture}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .explore-service-content {
      padding: 20px 16px;
      padding-bottom: 0px;
      height: 130px;

      .explore-service-profile {
        display: flex;
        align-items: center;

        .explore-service-profile-picture {
          width: 25px;
          height: 25px;
          border-radius: 9999px;
          background-image: url('${profilePicture}');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          margin-right: 10px;
        }

        .explore-service-profile-text {
          margin: 0;
          font-size: ${theme.fonts.xs};
          color: ${theme.colors.white};
          max-width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.sm};
          }

          & > span {
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.cyan};
            margin-left: 10px;
          }
        }
      }

      .explore-service-description {
        margin: 10px 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.base};
        }
      }
    }

    .explorer-card-button {
      width: 94px;
      height: 28px;
      margin: 0 auto;
      margin-bottom: 20px;

      @media (min-width: ${theme.screens.lg}) {
        width: 144px;
        height: 44px;
      }
    }
  `}
`;
