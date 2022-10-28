import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  currentDecentralizedCardImage: string;
  isHigher: boolean;
}

interface IDecentralizedUsersItemProps {
  currentUserImage: string;
}

interface IPrivateOptionQuestionProps {
  isExtended: boolean;
}

interface IImage {
  image: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, currentDecentralizedCardImage, isHigher }) => css`
    max-width: 1474px;
    margin: 0 auto;

    .main {
      min-height: 100vh;
      height: 100%;
      position: relative;

      @media (min-width: ${theme.screens.lg}) {
        display: grid;
        grid-gap: 64px;
        grid-template-columns: 563px 848px;
      }

      .main-content {
        padding: 0 20px;
        padding-top: 123px;
        align-self: center;
        position: relative;
        z-index: 10;

        @media (min-width: ${theme.screens.lg}) {
          padding: 0;
          padding-left: 40px;
        }

        @media (min-width: ${theme.screens['2xl']}) {
          padding: 0;
        }

        .main-title {
          font-size: ${theme.fonts['5xl']};
          font-family: 'HelveticaNowDisplay-Bold';
          color: ${theme.colors.white};
          position: relative;
          z-index: 10;
          line-height: 1.1;
          margin-bottom: 10px;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts['7xl']};
          }
        }

        ul {
          margin: 0;
          padding-inline-start: 20px;
        }

        .main-description {
          margin: 5px 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
          position: relative;
          z-index: 10;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.lg};
          }
        }

        .main-buttons {
          display: flex;
          grid-gap: 20px;
          margin-top: 16px;

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
              fill: ${theme.colors.cyan};
            }

            .main-line-button-text {
              font-family: 'HelveticaNowDisplay-Medium';
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.cyan};

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts.base};
              }
            }
          }
        }
      }

      .main-content-image {
        display: ${isHigher ? 'block' : 'none'};
        position: absolute;
        bottom: 0;
        background-image: url('/imgs/images/header.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 377px;

        @media (min-width: ${theme.screens.lg}) {
          display: block;
          position: initial;
          height: 100%;
          width: 100%;
        }
      }

      .main-content-explore {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;

        @media (min-width: ${theme.screens.lg}) {
          display: none;
        }

        .main-content-explore-text {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${isHigher ? theme.colors.white : theme.colors.bunting};
          margin-right: 5px;
        }

        & > svg {
          width: 20px;
          height: 20px;
          fill: ${isHigher ? theme.colors.white : theme.colors.bunting};
        }
      }
    }

    .actions {
      margin: 75px 20px;

      @media (min-width: ${theme.screens.lg}) {
        margin: 150px 0;
      }

      .actions-title {
        font-family: 'HelveticaNowDisplay-Bold';
        font-size: ${theme.fonts.xl};
        color: ${theme.colors.white};
        margin: 0;
        margin-bottom: 39px;
        text-align: center;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts['3xl']};
          margin-bottom: 47px;
        }
      }

      .actions-cards {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        grid-gap: 39px 18px;

        @media (min-width: ${theme.screens.lg}) {
          grid-gap: 0 88px;
        }

        .actions-card {
          width: 80px;
          cursor: pointer;

          .actions-card-content {
            width: 80px;
            height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid ${theme.colors.white}80;
            border-radius: 20px;
            background-color: ${theme.colors.brightGray};

            & > svg {
              width: 50px;
              height: 50px;
              fill: ${theme.colors.cyan}80;

              & > g > path {
                fill: ${theme.colors.cyan};
              }
            }
          }

          .actions-card-title {
            margin: 0;
            margin-top: 15px;
            font-family: 'HelveticaNowDisplay-Medium';
            font-size: ${theme.fonts.base};
            color: ${theme.colors.white};
            text-align: center;
          }

          .actions-card-description {
            margin: 0;
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.white}80;
            text-align: center;
          }
        }
      }
    }

    .decentralized {
      margin: 75px 20px;

      @media (min-width: ${theme.screens.lg}) {
        margin: 150px 0;
      }

      .decentralized-title {
        font-family: 'HelveticaNowDisplay-Bold';
        font-size: ${theme.fonts['4xl']};
        color: ${theme.colors.white};
        margin-bottom: 75px;
        max-width: 904px;
        text-align: center;
        line-height: 1.1;

        @media (min-width: ${theme.screens.lg}) {
          margin: 0 auto;
          margin-bottom: 100px;
          font-size: ${theme.fonts['6xl']};
        }
      }

      .decentralized-users {
        display: grid;
        grid-template-rows: repeat(3, auto);
        grid-template-areas: 'menu' 'card' 'list';

        @media (min-width: ${theme.screens.lg}) {
          grid-template-rows: auto 1fr;
          grid-template-columns: 532px 495px;
          grid-template-areas: 'menu card' 'list card';
          grid-gap: 0 115px;
          justify-content: center;
        }

        .decentralized-users-sort-menu {
          grid-area: menu;
          display: grid;
          grid-template-columns: 1fr 0.3fr;
          align-items: center;
          grid-gap: 10px;

          @media (min-width: ${theme.screens.lg}) {
            margin-bottom: 33px;
          }

          .decentralized-users-sort-menu-input {
            margin: 0;
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.bunting};
            background-color: ${theme.colors.white};
            border: 1px solid ${theme.colors.bunting}40;
            border-radius: 20px;
            padding: 10px;

            &:focus {
              outline: none;
            }

            @media (min-width: ${theme.screens.lg}) {
              padding: 10px 15px;
            }
          }

          .decentralized-users-sort-menu-option-menu {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-radius: 20px;
            border: 1px solid ${theme.colors.bunting}40;
            background-color: ${theme.colors.white};
            cursor: pointer;

            @media (min-width: ${theme.screens.lg}) {
              padding: 10px 15px;
            }

            .decentralized-users-sort-menu-option-menu-text {
              margin: 0;
              margin-right: 5px;
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.bunting};
            }

            & > svg {
              width: 20px;
              height: 20px;
              fill: ${theme.colors.bunting};
            }
          }
        }

        .decentralized-users-card-container {
          grid-area: card;
          width: 100%;

          .decentralized-users-card {
            width: 100%;
            height: auto;
            box-shadow: ${theme.shadows.smallest};
            background-color: ${theme.colors.white};
            padding: 15px 15px 10px 15px;
            margin-top: 16px;
            margin-bottom: 48px;
            position: relative;

            @media (min-width: ${theme.screens.lg}) {
              height: 504px;
              padding: 24px 24px 17px 24px;
              margin: 0;
            }

            .decentralized-users-card-box {
              height: 30px;
              width: 100px;
              border-radius: 20px;
              background-color: ${theme.colors.cyan};
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 5px;
              right: 5px;

              @media (min-width: ${theme.screens.lg}) {
                height: 40px;
                width: 128px;
                top: 8px;
                right: 8px;
              }

              & > svg {
                width: 20px;
                height: 20px;
                margin-right: 5px;

                & > .back {
                  fill: ${theme.colors.blueRibbon};
                }

                & > .front {
                  fill: ${theme.colors.cyan};
                }
              }

              .decentralized-users-card-box-title {
                margin: 0;
                font-family: 'HelveticaNowDisplay-Medium';
                font-size: ${theme.fonts.sm};
                color: ${theme.colors.blueRibbon};

                @media (min-width: ${theme.screens.lg}) {
                  font-size: ${theme.fonts.base};
                }
              }
            }

            .decentralized-users-card-image {
              background-image: url('${currentDecentralizedCardImage}');
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              width: 100%;
              height: 271px;

              @media (min-width: ${theme.screens.lg}) {
                height: 408px;
              }
            }

            .decentralized-users-card-bottom {
              padding-top: 11px;

              @media (min-width: ${theme.screens.lg}) {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 17px;
              }

              .decentralized-users-card-bottom-presentration {
                display: flex;
                align-items: center;

                .decentralized-users-card-bottom-presentration-image {
                  background-image: url('${currentDecentralizedCardImage}');
                  background-position: center;
                  background-repeat: no-repeat;
                  background-size: cover;
                  width: 25px;
                  height: 25px;
                  margin-right: 5px;
                  border-radius: 9999px;

                  @media (min-width: ${theme.screens.lg}) {
                    width: 38px;
                    height: 38px;
                    margin-right: 8px;
                  }
                }

                .decentralized-users-card-bottom-presentration-title {
                  margin: 0;
                  font-family: 'HelveticaNowDisplay-Medium';
                  font-size: ${theme.fonts.lg};
                  color: ${theme.colors.bunting};
                }
              }

              .decentralized-users-card-bottom-skills {
                display: flex;
                flex-wrap: nowrap;
                grid-gap: 5px;
                padding-top: 11px;

                @media (min-width: ${theme.screens.lg}) {
                  padding: 0;
                }

                .decentralized-users-card-bottom-skill {
                  margin: 0;
                  height: 100%;
                  padding: 5px 10px;
                  border-radius: 9999px;
                  background: linear-gradient(
                    to right,
                    ${theme.colors.rose}80,
                    ${theme.colors.blueRibbon}80
                  );
                  color: ${theme.colors.white};
                  font-family: 'HelveticaNowDisplay-Medium';
                  font-size: ${theme.fonts.sm};
                }
              }
            }
          }
        }

        .decentralized-users-list {
          grid-area: list;

          .is-active {
            border: 1px solid ${theme.colors.blueRibbon};
          }

          .decentralized-users-list-button {
            margin: 0 auto;
            margin-top: 20px;
            width: 200px;
            height: 58px;

            @media (min-width: ${theme.screens.lg}) {
              margin: 0;
              margin-top: 20px;
            }
          }
        }
      }
    }

    .private {
      margin: 0 20px;
      margin-bottom: 75px;
      display: grid;
      grid-template-areas: 'image' 'content';

      @media (min-width: ${theme.screens.lg}) {
        margin: 0;
        margin-bottom: 150px;
        grid-template-areas: 'image content';
        grid-template-columns: 623px 527px;
        justify-content: center;
        grid-gap: 102px;
      }

      .private-image {
        grid-area: image;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 357px;

        @media (min-width: ${theme.screens.lg}) {
          height: 656px;
        }
      }

      .private-image-first {
        background-image: url('/imgs/images/trust.jpg');
      }

      .private-image-second {
        background-image: url('/imgs/images/reputation.jpg');
      }

      .private-content {
        grid-area: content;
        align-self: center;
        height: 430px;

        @media (min-width: ${theme.screens.lg}) {
          height: 580px;
        }

        .private-content-title {
          margin: 0;
          color: ${theme.colors.white};
          font-size: ${theme.fonts['4xl']};
          font-family: 'HelveticaNowDisplay-Bold';
          line-height: 1.1;
          margin-top: 30px;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts['6xl']};
            margin: 0;
            margin-bottom: 20px;
          }
        }

        .private-content-description {
          margin: 12px 0;
          color: ${theme.colors.white};
          font-size: ${theme.fonts.sm};

          @media (min-width: ${theme.screens.lg}) {
            margin: 28px 0;
            font-size: ${theme.fonts.base};
          }
        }

        .private-button {
          width: 200px;
          height: 58px;
          margin: 0 auto;
          margin-top: 30px;

          @media (min-width: ${theme.screens.lg}) {
            margin: 0;
            margin-top: 30px;
          }
        }
      }
    }

    .private-different {
      @media (min-width: ${theme.screens.lg}) {
        grid-template-areas: 'content image';
        grid-template-columns: 527px 623px;
      }
    }

    .brands {
      margin-bottom: 75px;

      @media (min-width: ${theme.screens.lg}) {
        margin-bottom: 150px;
      }

      .brands-title {
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.xl};
        color: ${theme.colors.white};
        margin: 0;
        margin-bottom: 39px;
        text-align: center;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts['3xl']};
          margin-bottom: 47px;
        }
      }

      .brands-images {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        grid-gap: 39px 18px;

        @media (min-width: ${theme.screens.lg}) {
          grid-gap: 0 88px;
        }

        .brand-image {
          cursor: pointer;

          .brand-image-text {
            margin: 0;
            margin-top: 15px;
            font-family: 'HelveticaNowDisplay-Medium';
            font-size: ${theme.fonts.base};
            color: ${theme.colors.white};
            text-align: center;
          }
        }
      }
    }

    .people {
      padding: 0 20px;
      margin-bottom: 75px;

      @media (min-width: ${theme.screens.lg}) {
        padding: 0;
        margin-bottom: 150px;
      }

      .people-title {
        font-family: 'HelveticaNowDisplay-Bold';
        font-size: ${theme.fonts['4xl']};
        color: ${theme.colors.white};
        margin-bottom: 75px;
        max-width: 904px;
        text-align: center;
        line-height: 1.1;

        @media (min-width: ${theme.screens.lg}) {
          margin: 0 auto;
          margin-bottom: 100px;
          font-size: ${theme.fonts['6xl']};
        }
      }

      .people-tweets {
        display: grid;
        grid-gap: 39px 18px;

        @media (min-width: ${theme.screens.lg}) {
          grid-template-columns: repeat(3, auto);
        }
      }
    }
  `}
`;

export const BrandImage = styled.div<IImage>`
  ${({ theme, image }) => css`
    background-image: url('${image}');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 115px;
    height: 38px;
    margin: 0 auto;

    @media (min-width: ${theme.screens.lg}) {
      width: 175px;
      height: 56px;
    }
  `}
`;

export const PeopleTweet = styled.div<IImage>`
  ${({ theme, image }) => css`
    background-color: ${theme.colors.ebonyClay};
    border-radius: 8px;
    padding: 32px;
    box-shadow: ${theme.shadows.small};
    cursor: pointer;

    .people-tweet-header {
      display: grid;
      grid-template-columns: 48px auto 24px;

      .people-tweet-header-image {
        background-image: url('${image}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        border-radius: 9999px;
        width: 48px;
        height: 48px;
      }

      .people-tweet-header-texts {
        display: flex;
        flex-direction: column;
        margin-left: 10px;

        .people-tweet-header-texts-name {
          margin: 0;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white};
        }

        .people-tweet-header-texts-username {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white}80;
        }
      }

      .people-tweet-header-icon {
        width: 24px;
        height: 24px;

        & > svg {
          width: 24px;
          height: 24px;
          fill: ${theme.colors.white};
        }
      }
    }

    .people-tweet-description {
      margin: 0;
      margin-top: 10px;
      font-size: ${theme.fonts.base};
      color: ${theme.colors.white};
    }
  `}
`;

export const DecentralizedUsersItem = styled.div<IDecentralizedUsersItemProps>`
  ${({ theme, currentUserImage }) => css`
    width: 100%;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    height: 54px;
    cursor: pointer;

    @media (min-width: ${theme.screens.lg}) {
      height: 59px;
    }

    .decentralized-users-item-content {
      display: flex;
      align-items: center;

      .decentralized-users-item-content-image {
        background-image: url('${currentUserImage}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        margin-right: 8px;
      }

      .decentralized-users-item-content-title {
        font-size: ${theme.fonts.base};
        font-family: 'HelveticaNowDisplay-Medium';
        color: ${theme.colors.white};
        margin: 0;
        margin-right: 8px;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.lg};
        }
      }

      & > svg {
        width: 20px;
        height: 20px;

        & > .front {
          fill: ${theme.colors.blueCharcoal};
        }
      }
    }

    .decentralized-users-item-content-id {
      margin: 0;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white};

      @media (min-width: ${theme.screens.lg}) {
        font-size: ${theme.fonts.base};
      }
    }
  `}
`;

export const PrivateOptionQuestion = styled.div<IPrivateOptionQuestionProps>`
  ${({ theme, isExtended }) => css`
    height: ${isExtended ? 'auto' : '66px'};
    border-bottom: 1px solid ${theme.colors.white}33;

    .questions-option-header {
      width: 100%;
      height: ${isExtended ? '66px' : '100%'};
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      .questions-option-title {
        margin: 0;
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.xl};
        }
      }

      & > svg {
        fill: ${theme.colors.white};
        width: 24px;
        height: 24px;
        transform: ${isExtended ? 'rotate(180deg)' : 'rotate(0deg)'};
        transition: 0.5s;
      }
    }

    .questions-option-description {
      display: ${isExtended ? 'block' : 'none'};
      margin: 0;
      margin-bottom: 14px;
      font-size: ${theme.fonts.base};
      color: ${theme.colors.white};
      line-height: 1.4;
      transition: 0.5s;
    }
  `}
`;

export const Footer = styled.footer`
  ${({ theme }) => css`
    .footer-image {
      background-image: url('/imgs/images/footer.jpg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      width: 100%;
      height: 607px;
      display: grid;
      justify-content: center;
      align-content: flex-start;
      grid-gap: 47px;
      padding-top: 80px;

      @media (min-width: ${theme.screens.lg}) {
        height: 673px;
        padding-top: 50px;
      }

      .footer-image-title {
        font-family: 'HelveticaNowDisplay-Bold';
        font-size: ${theme.fonts['4xl']};
        color: ${theme.colors.cyan};
        text-align: center;
        padding: 0 20px;
        line-height: 1.1;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts['6xl']};
          padding: 0;
          max-width: 683px;
          width: 100%;
        }
      }

      .footer-image-button {
        width: 170px;
        height: 49px;
        margin: 0 auto;

        @media (min-width: ${theme.screens.lg}) {
          width: 231px;
          height: 58px;
        }
      }
    }

    .footer-content {
      padding: 35px 0;
      display: grid;
      justify-content: center;
      grid-gap: 95px;

      @media (min-width: ${theme.screens.lg}) {
        padding: 40px 94px;
        justify-content: space-between;
        align-items: center;
        grid-template-columns: repeat(2, auto);
        grid-gap: 0;
      }

      .footer-content-left {
        display: grid;
        grid-gap: 16px;

        @media (min-width: ${theme.screens.lg}) {
          grid-template-columns: repeat(2, auto);
          grid-gap: 32px;
          align-items: center;
        }

        .footer-content-left-logo {
          margin: 0 auto;

          @media (min-width: ${theme.screens.lg}) {
            margin: 0;
          }

          & > svg {
            width: 101px;
            height: 35px;

            @media (min-width: ${theme.screens.lg}) {
              height: 51px;
              width: 153px;
            }

            & > .color {
              fill: ${theme.colors.white};
            }
          }
        }

        .footer-content-left-text {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
          text-align: center;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.base};
            text-align: initial;
          }
        }
      }

      .footer-content-right {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        grid-gap: 36px;

        .footer-content-right-option {
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.base};
          margin: 0;
          color: ${theme.colors.white};
          cursor: pointer;
        }
      }
    }
  `}
`;
