import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    .person-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .person-header-text {
        margin: 0;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts.lg};
        }
      }

      .person-header-verify {
        margin: 0;
        font-size: ${theme.fonts.sm};
        color: ${theme.colors.white};
        background-color: ${theme.colors.brightGray};
        border-radius: 20px;
        padding: 6px 10px;
        cursor: pointer;
      }
    }

    .person-box {
      display: grid;
      grid-gap: 17px;
    }

    .person-box-item {
      display: grid;
      grid-template-columns: 26px auto 56px;
      background-color: ${theme.colors.white}0D;
      border: 1px solid ${theme.colors.scorpion}80;
      border-radius: 15px;
      padding: 16px;

      .person-box-icon {
        width: 26px;
        height: 26px;

        & > svg {
          width: 26px;
          height: 26px;
        }
      }

      .person-box-item-texts {
        margin-left: 14px;

        .person-box-item-title {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
        }

        .person-box-item-description {
          margin: 0;
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};
        }

        .person-box-item-dates {
          display: flex;
          grid-gap: 14px;
          margin-top: 31px;

          .person-box-item-date {
            .person-box-item-date-title {
              margin: 0;
              font-size: ${theme.fonts.xs};
              color: ${theme.colors.white}B3;
            }

            .person-box-item-date-text {
              margin: 0;
              font-size: ${theme.fonts.xs};
              color: ${theme.colors.white};
            }
          }
        }
      }

      .person-box-item-content {
        position: relative;
        display: flex;

        .person-box-item-icon {
          & > svg {
            opacity: 0.2;
          }
        }

        .person-box-item-icon-is-active {
          & > svg {
            opacity: 1;
          }
        }

        .person-box-more-vert {
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

        .person-box-item-tooltip-box {
          position: absolute;
          top: -40px;
          right: 45px;
        }

        .person-box-more-vert-inline-dropdown {
          position: absolute;
          bottom: 16px;
          right: 30px;
          z-index: 10;

          @media (min-width: ${theme.screens.lg}) {
            bottom: 16px;
            right: initial;
            left: 56px;
          }
        }
      }
    }
  `}
`;
