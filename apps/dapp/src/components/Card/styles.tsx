import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface ICardProps {
  isEmpty?: Boolean;
  image?: string;
  builderCredentialColor?: string;
}

export const SimpleCardWrapper = styled.div<ICardProps>`
  ${({ theme, isEmpty }) => css`
    display: grid;
    grid-template-columns: auto 30px;
    background-color: ${theme.colors.ebonyClay};
    border: 1px solid ${theme.colors.scorpion}80;
    border-radius: 15px;
    padding: 14px 16px;

    @media (min-width: ${theme.screens.lg}) {
      padding: 16px 20px;
    }

    ${isEmpty &&
    css`
      opacity: 0.7;
    `}

    .card-item-content-left {
      .card-item-content-title {
        display: flex;
        align-items: center;
        margin-bottom: 2px;

        .card-icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;

          & > svg {
            width: 20px;
            height: 20px;
          }
        }

        .card-item-title {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
          font-family: 'HelveticaNowDisplay-Medium';
        }
      }

      .card-item-description {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white}B3;
      }

      .card-item-dates {
        display: flex;
        grid-gap: 14px;
        margin-top: 20px;

        .card-item-date {
          .card-item-date-title {
            margin: 0;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white}B3;
          }

          .card-item-date-text {
            margin: 0;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white};
            font-family: 'HelveticaNowDisplay-Medium';
          }
        }
      }
    }

    .card-item-content-right {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .card-item-icon {
        & > svg {
          opacity: 0.2;
        }
      }

      .card-item-icon-is-active {
        & > svg {
          opacity: 1;
        }
      }

      .card-more-vert {
        width: 30px;
        height: 26px;
        text-align: center;
        cursor: pointer;

        & > svg {
          width: 30px;
          height: 26px;
          fill: ${theme.colors.white};
        }
      }

      .card-item-tooltip-box {
        position: absolute;
        top: -40px;
        right: 20px;
      }

      .card-more-vert-inline-dropdown {
        position: absolute;
        bottom: 10px;
        right: 30px;
        z-index: 10;
      }
    }
  `}
`;

export const SmallCardWrapper = styled.div<ICardProps>`
  ${({ theme, image, isEmpty, builderCredentialColor }) => css`
    width: 100%;
    background-color: ${theme.colors.ebonyClay};
    border: 1px solid ${theme.colors.scorpion}80;
    border-radius: 15px;
    padding: 16px 20px;
    display: grid;
    grid-template-areas: 'information top-icon' 'dates bottom-icon';
    grid-template-rows: auto 31px;
    grid-gap: 47px 0;
    position: relative;

    ${isEmpty &&
    css`
      opacity: 0.7;
    `}

    ${builderCredentialColor &&
    css`
      .card-border {
        height: 100%;
        width: 5px;
        background-color: ${theme.colors[builderCredentialColor]}CC;
        position: absolute;
        left: 0;
        border-radius: 15px 0 0 15px;
      }
    `}

    @media (min-width: ${theme.screens.lg}) {
      grid-template-rows: auto 44px;
    }

    .card-information {
      .card-information-title {
        margin: 0;
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
        font-family: 'HelveticaNowDisplay-Medium';
        word-wrap: break-word;
        max-width: 200px;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.xl};
          max-width: 250px;
        }
      }

      .card-information-company {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white}B3;
        word-wrap: break-word;
        max-width: 200px;

        @media (min-width: ${theme.screens.lg}) {
          max-width: 250px;
        }
      }
    }

    .card-top-icons {
      justify-self: flex-end;
      display: flex;

      .card-top-icon {
        width: 30px;
        height: 30px;

        & > svg {
          width: 30px;
          height: 30px;
          opacity: 0.2;
        }
      }

      .card-top-icon-is-active {
        & > svg {
          opacity: 1;
        }
      }

      .card-top-more-vert {
        cursor: pointer;
        width: 30px;
        height: 30px;

        & > svg {
          width: 30px;
          height: 30px;
          fill: ${theme.colors.white};
        }
      }
    }

    .card-dates {
      display: flex;
      grid-gap: 14px;
      align-self: center;

      .card-date {
        .card-date-title {
          margin: 0;
          font-size: ${theme.fonts.xs};
          color: ${theme.colors.white}B3;
        }

        .card-date-text {
          margin: 0;
          font-size: ${theme.fonts.xs};
          color: ${theme.colors.white};
          font-family: 'HelveticaNowDisplay-Medium';
        }
      }
    }

    .card-bottom-icon {
      width: 81px;
      height: 31px;
      justify-self: flex-end;
      align-self: flex-end;
      background-image: url('${image}');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;

      @media (min-width: ${theme.screens.lg}) {
        width: 112px;
        height: 44px;
      }
    }

    .card-tooltip-box {
      position: absolute;
      top: -30px;
      right: 70px;
    }

    .card-more-vert-inline-dropdown {
      position: absolute;
      bottom: 110px;
      right: 50px;
      z-index: 10;
    }
  `}
`;

export const LongCardWrapper = styled.div<ICardProps>`
  ${({ theme, image, isEmpty }) => css`
    width: 100%;
    background-color: ${theme.colors.ebonyClay};
    border: 1px solid ${theme.colors.scorpion}80;
    border-radius: 15px;
    padding: 16px 20px;
    display: grid;
    grid-template-columns: ${isEmpty ? '79px auto 24px' : '79px auto 48px'};
    grid-gap: 15px;
    position: relative;

    @media (min-width: ${theme.screens.lg}) {
      grid-template-columns: ${isEmpty ? '134px auto 30px' : '134px auto 60px'};
      grid-gap: 23px;
    }

    ${isEmpty &&
    css`
      opacity: 0.7;
    `}

    .card-image-container {
      height: 63px;
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: center;
      border-radius: 10px;
      background-color: ${theme.colors.gray};

      @media (min-width: ${theme.screens.lg}) {
        height: 85px;
      }

      .card-image {
        width: 48px;
        height: 18px;
        background-image: url('${image}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;

        @media (min-width: ${theme.screens.lg}) {
          width: 85px;
          height: 31px;
        }
      }
    }

    .card-information {
      .card-information-title {
        margin: 0;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};
        font-family: 'HelveticaNowDisplay-Medium';
        word-wrap: break-word;
        max-width: 150px;

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.xl};
          max-width: 400px;
        }
      }

      .card-information-description {
        margin: 0;
        margin-top: 5px;
        font-size: ${theme.fonts.xs};
        color: ${theme.colors.white}B3;
        word-wrap: break-word;
        max-width: 150px;

        @media (min-width: ${theme.screens.lg}) {
          margin: 0;
          font-size: ${theme.fonts.sm};
          max-width: 400px;
        }
      }

      .card-information-dates {
        display: flex;
        grid-gap: 10px;

        .card-information-date {
          margin: 0;
          margin-top: 25px;
          font-size: ${theme.fonts.xs};
          color: ${theme.colors.white}B3;

          & > span {
            color: ${theme.colors.white};
            font-family: 'HelveticaNowDisplay-Medium';
          }

          @media (min-width: ${theme.screens.lg}) {
            margin-top: 16px;
          }
        }
      }
    }

    .card-icons {
      display: flex;

      .card-icon {
        width: 24px;
        height: 24px;

        @media (min-width: ${theme.screens.lg}) {
          width: 30px;
          height: 30px;
        }

        & > svg {
          width: 24px;
          height: 24px;
          opacity: 0.2;

          @media (min-width: ${theme.screens.lg}) {
            width: 30px;
            height: 30px;
          }
        }
      }

      .card-icon-is-active {
        & > svg {
          opacity: 1;
        }
      }

      .card-more-vert {
        cursor: pointer;
        width: 24px;
        height: 24px;

        @media (min-width: ${theme.screens.lg}) {
          width: 30px;
          height: 30px;
        }

        & > svg {
          width: 24px;
          height: 24px;
          fill: ${theme.colors.white};

          @media (min-width: ${theme.screens.lg}) {
            width: 30px;
            height: 30px;
          }
        }
      }
    }

    .card-tooltip-box {
      position: absolute;
      top: -20px;
      right: 70px;
    }

    .card-more-vert-inline-dropdown {
      position: absolute;
      bottom: 110px;
      right: 45px;
      z-index: 10;

      @media (min-width: ${theme.screens.lg}) {
        bottom: 69px;
      }
    }
  `}
`;
