import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  profilePicture: string;
  isCurrentProfile: boolean;
}

interface IBackgrounProps {
  image: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, profilePicture, isCurrentProfile }) => css`
    max-width: 1238px;
    margin: 0 auto;

    .profile-container {
      position: relative;
      height: ${isCurrentProfile ? '318px' : '390px'};

      @media (min-width: ${theme.screens.lg}) {
        height: 365px;
        margin-top: 30px;
      }

      .profile {
        display: grid;
        grid-template-areas: 'photo' 'info' 'buttons';
        justify-content: center;
        position: relative;
        bottom: 63px;
        left: 0;
        right: 0;

        @media (min-width: ${theme.screens.lg}) {
          bottom: 80px;
        }

        @media (min-width: ${theme.screens.lg}) {
          grid-template-areas: 'photo info buttons';
          grid-template-columns: 215px auto 300px;
          justify-content: initial;
          align-items: end;
        }

        .profile-photo {
          grid-area: photo;
          width: 128px;
          height: 128px;
          border-radius: 9999px;
          border: 2px solid ${theme.colors.white};
          position: relative;
          justify-self: center;
          border-radius: 9999px;
          background-image: url('${profilePicture}');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          background-color: ${theme.colors.ebony};

          @media (min-width: ${theme.screens.lg}) {
            width: 171px;
            height: 171px;
            justify-self: end;
          }
        }

        .profile-info {
          grid-area: info;
          margin-top: 14px;
          justify-self: center;

          @media (min-width: ${theme.screens.lg}) {
            justify-self: initial;
            margin: 0;
            margin-left: 12px;
            margin-bottom: 12px;
          }

          .profile-info-naming {
            display: flex;
            align-items: center;

            .profile-info-name {
              margin: 0;
              font-size: ${theme.fonts.xl};
              color: ${theme.colors.white};
              max-width: 250px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts['2xl']};
                max-width: 600px;
              }
            }

            .profile-info-token {
              margin: 0;
              margin-left: 10px;
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.cyan};
            }
          }

          .profile-info-follow {
            margin-top: 19px;
            text-align: center;

            @media (min-width: ${theme.screens.lg}) {
              margin-top: 8px;
              text-align: initial;
            }

            .profile-info-followers {
              margin: 0;
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.white};
              text-decoration: underline;

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts.base};
              }

              .profile-info-followers-text {
                color: ${theme.colors.white}B3;
              }
            }

            .profile-info-follow-dot {
              display: inline-block;
              margin: 0 8px;
              width: 3px;
              height: 3px;
              background-color: ${theme.colors.alto};
              border-radius: 9999px;
            }
          }
        }

        .profile-buttons {
          grid-area: buttons;
          display: grid;
          grid-template-columns: repeat(2, 150px);
          grid-gap: 8px;
          margin-top: 30px;

          & > button {
            height: 44px;
          }

          @media (min-width: ${theme.screens.lg}) {
            & > button {
              height: 50px;
            }
          }
        }
      }
    }

    .content-container {
      padding: 0 20px;
      margin-top: 28px;
      margin-bottom: 120px;
      overflow: hidden;

      @media (min-width: ${theme.screens.lg}) {
        padding: 0;
        margin-top: 37px;
        display: grid;
        grid-template-columns: 363px 830px;
        grid-gap: 44px;
      }

      .content-filter-menu {
        display: flex;
        grid-gap: 28px;
        overflow-x: scroll;
        height: 40px;
        scrollbar-width: none;

        @media (min-width: ${theme.screens.lg}) {
          height: initial;
        }

        &::-webkit-scrollbar {
          display: none;
        }

        .content-filter-menu-item {
          margin: 0;
          height: fit-content;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white}80;
          white-space: nowrap;
          padding-bottom: 6px;
          cursor: pointer;
        }

        .content-filter-menu-item-active {
          color: ${theme.colors.white};
          border-bottom: 1px solid ${theme.colors.white};
        }
      }

      .content-filter-menu-hidden {
        display: none;
      }

      .content-left {
        & > :nth-of-type(2) {
          margin-top: 32px;
        }

        @media (min-width: ${theme.screens.lg}) {
          & > :nth-of-type(2) {
            margin: 0;
          }
        }
      }

      .content-right {
      }
    }
  `}
`;

export const LoadingWrapper = styled.div`
  margin: 0 auto;
  margin-top: 20px;
  width: 60px;
  height: 60px;
`;

export const Background = styled.div<IBackgrounProps>`
  ${({ theme, image }) => css`
    width: 100%;
    height: 165px;
    position: relative;
    ${image
      ? css`
          background-image: url(${image});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        `
      : css`
          background: linear-gradient(
            90deg,
            rgba(2, 0, 36, 1) 0%,
            rgba(50, 50, 128, 1) 41%,
            rgba(0, 212, 255, 1) 100%
          );
        `}

    @media (min-width: ${theme.screens.lg}) {
      height: 273px;
      border-radius: 25px;
    }
  `}
`;

export const Skills = styled.div`
  ${({ theme }) => css`
    .skills-header {
      margin-bottom: 10px;

      .skills-header-text {
        margin: 0;
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
      }
    }

    .skills-box-loading {
      height: 209px;
    }

    .skills-not-elements {
      background-color: ${theme.colors.ebonyClay};
      border: 1px solid ${theme.colors.scorpion}80;
      border-radius: 15px;
      padding: 44px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .skills-not-elements-image {
        width: 243px;
        height: 51px;
      }

      .skills-not-elements-title {
        margin: 20px auto;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
      }

      .skills-not-elements-description {
        margin: 0;
        background: linear-gradient(
          99.09deg,
          ${theme.colors.cyan} 0%,
          ${theme.colors.heliotrope} 105.11%
        );
        background-clip: text;
        text-fill-color: ${theme.colors.transparent};
        font-size: ${theme.fonts.sm};
      }
    }

    .skills-box {
      background-color: ${theme.colors.ebonyClay};
      border: 1px solid ${theme.colors.scorpion}80;
      border-radius: 15px;
      padding: 16px 20px;
      display: flex;
      flex-wrap: wrap;
      grid-gap: 8px;
      min-height: 209px;
      height: 100%;
    }

    .skills-box-item {
      border: 1px solid ${theme.colors.melrose};
      border-radius: 20px;
      padding: 4px 14px;
      height: 100%;
      width: fit-content;

      .skills-box-item-text {
        margin: 0;
        font-size: ${theme.fonts.xs};
        color: ${theme.colors.melrose};

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.sm};
        }
      }
    }
  `}
`;
