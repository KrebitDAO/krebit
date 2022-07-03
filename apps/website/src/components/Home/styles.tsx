import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface Props {
  currentDecentralizedCardImage: string;
}

interface DecentralizedUsersItemProps {
  currentUserImage: string;
}

interface PrivateOptionQuestionProps {
  isExtended: boolean;
}

export const Wrapper = styled.div<Props>`
  ${({ theme, currentDecentralizedCardImage }) => css`
    max-width: 1474px;
    margin: 0 auto;

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
        align-self: center;
        position: relative;
        z-index: 10;

        @media (min-width: ${theme.screens.xl}) {
          padding: 0;
        }

        .main-title {
          font-size: ${theme.fonts['5xl']};
          font-family: 'HelveticaNowDisplay-Bold';
          color: ${theme.colors.bunting};
          position: relative;
          z-index: 10;
          line-height: 1.1;

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
        background-image: url('/imgs/images/istockphoto-1372115212-612x612.jpg');
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
      margin: 75px 20px;

      @media (min-width: ${theme.screens.lg}) {
        margin: 150px 0;
      }

      .decentralized-title {
        font-family: 'HelveticaNowDisplay-Bold';
        font-size: ${theme.fonts['4xl']};
        color: ${theme.colors.bunting};
        margin-bottom: 75px;
        max-width: 904px;
        text-align: center;
        line-height: 1.1;

        @media (min-width: ${theme.screens.lg}) {
          margin: 0 auto;
          margin-bottom: 150px;
          font-size: ${theme.fonts['6xl']};
        }
      }

      .decentralized-users {
        display: grid;
        grid-template-rows: 60px auto auto;
        grid-template-areas: 'menu' 'card' 'list';

        @media (min-width: ${theme.screens.lg}) {
          grid-template-rows: 120px 1fr;
          grid-template-columns: 532px 495px;
          grid-template-areas: 'menu card' 'list card';
          grid-gap: 0 115px;
          justify-content: center;
        }

        .decentralized-users-sort-menu {
          grid-area: menu;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          align-self: flex-end;

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
            padding: 5px 10px;
            width: 240px;

            &:focus {
              outline: none;
            }

            @media (min-width: ${theme.screens.lg}) {
              padding: 10px 15px;
              width: 340px;
            }
          }

          .decentralized-users-sort-menu-option {
            display: flex;
            align-items: center;

            .decentralized-users-sort-menu-option-title {
              margin: 0;
              margin-right: 21px;
              font-size: ${theme.fonts.sm};
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

      .private-button {
        width: 211px;
        height: 59px;
        @media (min-width: ${theme.screens.lg}) {
          width: 211px;
          height: 58px;
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

        .private-content-title {
          margin: 0;
          color: ${theme.colors.bunting};
          font-size: ${theme.fonts['4xl']};
          font-family: 'HelveticaNowDisplay-Bold';
          line-height: 1.1;
          margin-top: 30px;

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts['6xl']};
            margin: 0;
          }
        }

        .private-content-description {
          margin: 12px 0;
          color: ${theme.colors.bunting};
          font-size: ${theme.fonts.sm};

          @media (min-width: ${theme.screens.lg}) {
            margin: 28px 0;
            font-size: ${theme.fonts.base};
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
        color: ${theme.colors.bunting};
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

        .brands-images-1 {
          background-image: url('/imgs/logos/openzepellin-logo.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          width: 163px;
          height: 19px;

          @media (min-width: ${theme.screens.lg}) {
            width: 249px;
            height: 29px;
          }
        }

        .brands-images-2 {
          background-image: url('/imgs/logos/ceramic.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          width: 115px;
          height: 38px;

          @media (min-width: ${theme.screens.lg}) {
            width: 175px;
            height: 56px;
          }
        }

        .brands-images-3 {
          background-image: url('/imgs/logos/ethereum-logo.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          width: 87px;
          height: 34px;

          @media (min-width: ${theme.screens.lg}) {
            width: 141px;
            height: 56px;
          }
        }

        .brands-images-4 {
          background-image: url('/imgs/logos/fleek-logo.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          width: 82px;
          height: 34px;

          @media (min-width: ${theme.screens.lg}) {
            width: 128px;
            height: 56px;
          }
        }

        .brands-images-5 {
          background-image: url('/imgs/logos/metamask-logo.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          width: 105px;
          height: 34px;

          @media (min-width: ${theme.screens.lg}) {
            width: 187px;
            height: 61px;
          }
        }

      }
    }
  `}
`;

export const DecentralizedUsersItem = styled.div<DecentralizedUsersItemProps>`
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
        color: ${theme.colors.bunting};
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
          fill: ${theme.colors.wildSand};
        }
      }
    }

    .decentralized-users-item-content-id {
      margin: 0;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.bunting};

      @media (min-width: ${theme.screens.lg}) {
        font-size: ${theme.fonts.base};
      }
    }
  `}
`;

export const PrivateOptionQuestion = styled.div<PrivateOptionQuestionProps>`
  ${({ theme, isExtended }) => css`
    height: ${isExtended ? 'auto' : '66px'};
    border-bottom: 1px solid ${theme.colors.haiti}33;

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
        color: ${theme.colors.bunting};

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.xl};
        }
      }

      & > svg {
        color: ${theme.colors.bunting};
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
      color: ${theme.colors.bunting};
      line-height: 1.4;
      transition: 0.5s;
    }
  `}
`;

export const Footer = styled.footer`
  ${({ theme }) => css`
    .footer-image {
      background-image: url('/imgs/images/istockphoto-1372115185-612x612.jpg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      width: 100%;
      height: 607px;
      display: grid;
      justify-content: center;
      align-content: flex-start;
      padding-top: 3em;
      grid-gap: 58px;

      @media (min-width: ${theme.screens.lg}) {
        height: 673px;
        grid-gap: 47px;
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
          width: 211px;
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
          color: ${theme.colors.bunting};

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.base};
          }
        }
      }

      .footer-content-right {
        display: flex;
        grid-gap: 36px;

        .footer-content-right-option {
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.base};
          margin: 0;
          color: ${theme.colors.bunting};
          cursor: pointer;
        }
      }
    }
  `}
`;
