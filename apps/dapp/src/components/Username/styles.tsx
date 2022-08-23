import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IBackgrounProps {
  image: string;
}

export const Wrapper = styled.div`
  ${({ theme }) => css`
    max-width: 1216px;
    margin: 0 auto;

    .profile-container {
      position: relative;
      height: 390px;

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

          img {
            border-radius: 9999px;
          }

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
            .profile-info-name {
              margin: 0;
              font-size: ${theme.fonts.xl};
              color: ${theme.colors.white};

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts['2xl']};
              }
            }

            .profile-info-token {
              margin: 0;
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

      @media (min-width: ${theme.screens.lg}) {
        padding: 0;
        margin-top: 31px;
        display: grid;
        grid-gap: 85px;
        grid-template-columns: 358px 773px;
      }

      .content-left {
      }

      .content-right {
        margin-top: 36px;

        @media (min-width: ${theme.screens.lg}) {
          margin: 0;
        }
      }
    }
  `}
`;

export const Background = styled.div<IBackgrounProps>`
  ${({ theme, image }) => css`
    width: 100%;
    height: 165px;
    position: relative;
    background-image: url(${image});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    @media (min-width: ${theme.screens.lg}) {
      height: 273px;
      border-radius: 25px;
    }
  `}
`;

export const PersonhoodCredential = styled.div`
  ${({ theme }) => css`
    .person-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .person-header-text {
        margin: 0;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};
      }
    }

    .person-box {
      background-color: ${theme.colors.white}0D;
      border: 1px solid ${theme.colors.scorpion}80;
      border-radius: 15px;
      padding: 16px 20px;
    }

    .person-box-item {
      display: grid;
      align-items: center;
      grid-template-columns: 26px auto 22px;

      .person-box-item-icon {
        width: 26px;
        height: 26px;

        & > svg {
          width: 26px;
          height: 26px;
        }
      }

      .person-box-item-text {
        margin: 0;
        margin-left: 14px;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
      }
    }

    .person-box-item-hr {
      width: 100%;
      border: 1px solid ${theme.colors.gray}33;
    }
  `}
`;

export const Skills = styled.div`
  ${({ theme }) => css`
    margin-top: 36px;

    .skills-header {
      margin-bottom: 10px;

      .skills-header-text {
        margin: 0;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};
      }
    }

    .skills-box {
      background-color: ${theme.colors.white}0D;
      border: 1px solid ${theme.colors.scorpion}80;
      border-radius: 15px;
      padding: 28px 20px;
      display: flex;
      flex-wrap: wrap;
      grid-gap: 8px;
    }

    .skills-box-item {
      border: 1px solid ${theme.colors.white}80;
      border-radius: 20px;
      padding: 4px 14px;
      width: fit-content;

      .skills-box-item-text {
        margin: 0;
        font-size: ${theme.fonts.xs};
        color: ${theme.colors.white}80;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.sm};
        }
      }
    }
  `}
`;

export const EducationCredentials = styled.div`
  ${({ theme }) => css`
    .education-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .education-header-text {
        margin: 0;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};
      }
    }

    .education-cards {
      display: grid;
      grid-gap: 17px;

      @media (min-width: ${theme.screens.lg}) {
        grid-template-columns: repeat(2, 378px);
      }
    }

    .education-card {
      width: 100%;
      background-color: ${theme.colors.white}0D;
      border: 1px solid ${theme.colors.scorpion}80;
      border-radius: 15px;
      padding: 20px;
      display: grid;
      grid-template-areas: 'information top-icon' 'dates bottom-icon';
      grid-gap: 35px 0;

      .education-card-information {
        .education-card-information-title {
          margin: 0;
          font-size: ${theme.fonts.lg};
          color: ${theme.colors.white};

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.xl};
          }
        }

        .education-card-information-company {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white}B3;
        }
      }

      .education-card-top-icon {
        width: 24px;
        height: 24px;
        justify-self: flex-end;

        @media (min-width: ${theme.screens.lg}) {
          width: 31px;
          height: 31px;
        }

        & > svg {
          width: 24px;
          height: 24px;

          @media (min-width: ${theme.screens.lg}) {
            width: 31px;
            height: 31px;
          }
        }
      }

      .education-card-dates {
        display: flex;
        grid-gap: 14px;

        .education-card-date {
          .education-card-date-title {
            margin: 0;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white}B3;
          }

          .education-card-date-text {
            margin: 0;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white};
          }
        }
      }

      .education-card-bottom-icon {
        width: 81px;
        height: 31px;
        justify-self: flex-end;
        align-self: flex-end;
        position: relative;

        @media (min-width: ${theme.screens.lg}) {
          width: 112px;
          height: 44px;
        }

        img {
          width: 81px;
          height: 31px;

          @media (min-width: ${theme.screens.lg}) {
            width: 112px;
            height: 44px;
          }
        }
      }
    }

    .education-view-more {
      margin: 0;
      margin-top: 20px;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white};
      text-decoration: underline;
      text-align: center;
      cursor: pointer;

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 36px;
        font-size: ${theme.fonts.base};
      }
    }
  `}
`;

export const WorkCredential = styled.div`
  ${({ theme }) => css`
    margin-top: 36px;

    .work-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .work-header-text {
        margin: 0;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};
      }
    }

    .work-cards {
      display: grid;
      grid-gap: 17px;
    }

    .work-card {
      width: 100%;
      background-color: ${theme.colors.white}0D;
      border: 1px solid ${theme.colors.scorpion}80;
      border-radius: 15px;
      padding: 20px;
      display: grid;
      grid-template-columns: 79px auto 24px;
      grid-gap: 15px;

      @media (min-width: ${theme.screens.lg}) {
        padding: 19px 17px;
        grid-template-columns: 134px auto 31px;
        grid-gap: 23px;
      }

      .work-card-image {
        position: relative;
        width: 100%;
        height: 63px;
        background-color: ${theme.colors.white};
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;

        @media (min-width: ${theme.screens.lg}) {
          height: 85px;
        }
      }

      .work-card-information {
        .work-card-information-title {
          margin: 0;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white};

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.xl};
          }
        }

        .work-card-information-description {
          margin: 0;
          margin-top: 5px;
          font-size: ${theme.fonts.xs};
          color: ${theme.colors.white}B3;

          @media (min-width: ${theme.screens.lg}) {
            margin: 0;
            font-size: ${theme.fonts.sm};
          }
        }

        .work-card-information-date {
          margin: 0;
          margin-top: 25px;
          font-size: ${theme.fonts.xs};
          color: ${theme.colors.white}B3;

          & > span {
            color: ${theme.colors.white};
          }

          @media (min-width: ${theme.screens.lg}) {
            margin-top: 16px;
          }
        }
      }

      .work-card-icon {
        width: 24px;
        height: 24px;

        @media (min-width: ${theme.screens.lg}) {
          width: 31px;
          height: 31px;
        }

        & > svg {
          width: 24px;
          height: 24px;

          @media (min-width: ${theme.screens.lg}) {
            width: 31px;
            height: 31px;
          }
        }
      }
    }

    .work-view-more {
      margin: 0;
      margin-top: 20px;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white};
      text-decoration: underline;
      text-align: center;

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 36px;
        font-size: ${theme.fonts.base};
      }
    }
  `}
`;
