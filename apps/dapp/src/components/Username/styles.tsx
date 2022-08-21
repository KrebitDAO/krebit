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
