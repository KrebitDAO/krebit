import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {}

export const Wrapper = styled.div<IProps>`
  ${({ theme }) => css`
    padding: 0 20px;

    @media (min-width: ${theme.screens.xl}) {
      padding: 0;
      margin-right: 80px;
      float: right;
    }

    @media (min-width: ${theme.screens['2xl']}) {
      max-width: 1238px;
      margin: 0 auto;
      float: initial;
    }

    .credential-loading {
      margin: 0 auto;
      margin-top: 20px;
      width: 60px;
      height: 60px;
    }

    .credential-header {
      margin-top: 15px;
      margin-bottom: 34px;
      display: flex;

      .credential-header-icon {
        width: 20px;
        height: 20px;
        transform: rotate(180deg);

        & > svg {
          width: 20px;
          height: 20px;
          fill: ${theme.colors.white};
        }
      }

      .credential-header-texts {
        margin-left: 12px;

        .credential-header-texts-title {
          margin: 0;
          font-family: 'HelveticaNowDisplay-Bold';
          font-size: ${theme.fonts.lg};
          color: ${theme.colors.white};
          margin-bottom: 4px;
        }

        .credential-header-texts-subtitle {
          margin: 0;
          font-size: ${theme.fonts.xs};
          color: ${theme.colors.white};

          & > span {
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.cyan};
            text-decoration: underline;
          }
        }
      }
    }

    .credential-card {
      .credential-card-header {
        display: flex;
        margin-bottom: 14px;

        .credential-card-header-title {
          margin: 0;
          font-family: 'HelveticaNowDisplay-Bold';
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white};

          & > span {
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.white}B3;
            text-decoration: underline;
          }
        }

        .credential-card-header-icon {
          width: 20px;
          height: 20px;
          margin-left: 11px;

          & > svg {
            width: 20px;
            height: 20px;
            fill: ${theme.colors.white};
          }
        }
      }
    }

    .credential-form {
      margin-top: 50px;
      display: grid;
      grid-gap: 24px;

      .credential-form-boxes {
        .credential-form-boxes-title {
          margin: 0;
          margin-bottom: 10px;
          font-family: 'HelveticaNowDisplay-Medium';
          font-size: ${theme.fonts.sm};
          color: ${theme.colors.white}B3;
        }

        .credential-form-boxes-content {
          display: flex;
          flex-wrap: wrap;
          grid-gap: 8px;

          .credential-form-box {
            border: 1px solid ${theme.colors.melrose};
            border-radius: 20px;
            padding: 4px 14px;
            height: 33px;
            width: fit-content;
            cursor: pointer;
            display: flex;
            align-items: center;

            .credential-form-box-close {
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

            .credential-form-box-text {
              margin: 0;
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.melrose};
            }
          }

          .credential-form-box-add {
            width: 33px;
            height: 33px;
            border: 1px solid ${theme.colors.melrose};
            border-radius: 9999px;
            display: flex;
            justify-content: center;
            align-items: center;

            & > svg {
              width: 20px;
              height: 20px;
              fill: ${theme.colors.melrose};
            }
          }
        }
      }

      .credential-form-upload-input {
        cursor: pointer;
        height: 38px;
        display: flex;
        align-items: center;

        & > input {
          display: none;
        }

        .credential-form-upload-input-label {
          display: flex;
          align-items: center;
          height: 100%;
          width: 100%;

          & > p {
            margin: 0;
            color: ${theme.colors.white}B3;
            font-size: ${theme.fonts.base};
            text-decoration: underline;
          }

          & > svg {
            width: 20px;
            height: 20px;
            fill: ${theme.colors.white}B3;
            margin-left: 10px;
          }
        }
      }
    }

    .credential-issue-to {
      margin-top: 36px;
      margin-bottom: 48px;

      .credential-issue-to-title {
        margin: 0;
        margin-bottom: 16px;
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};
      }

      .credential-issue-to-list {
        .credential-issue-to-item {
          border-bottom: 1px solid ${theme.colors.white}80;

          .credential-issue-to-item-text {
            margin: 0;
            color: ${theme.colors.white}B3;
            font-size: ${theme.fonts.sm};
          }
        }
      }
    }
  `}
`;
