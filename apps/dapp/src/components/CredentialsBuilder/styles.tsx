import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {}

export const Wrapper = styled.div<IProps>`
  ${({ theme }) => css`
    padding: 0 20px;
    max-width: 1238px;
    margin: 0 auto;

    @media (min-width: ${theme.screens.lg}) {
      padding: 0;
    }

    .credential-loading {
      margin: 0 auto;
      margin-top: 20px;
      width: 60px;
      height: 60px;
    }

    .credential-not-authenticated {
      height: calc(100vh - 56px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      grid-gap: 32px;

      .credential-not-authenticated-title {
        margin: 0;
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.lg};
        color: ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          font-size: ${theme.fonts['2xl']};
        }
      }

      .credential-not-authenticated-button {
        width: 142px;
        height: 50px;
      }
    }

    .credential-container {
      display: grid;
      margin-bottom: 120px;
      grid-template-areas: 'header' 'card' 'form' 'issueTo' 'button';

      @media (min-width: ${theme.screens.lg}) {
        margin-top: 58px;
        grid-gap: 0 88px;
        grid-template-areas: 'header header' 'form card' 'form issueTo' 'button issueTo';
        grid-template-columns: auto 586px;
      }

      .credential-header {
        margin-top: 15px;
        margin-bottom: 34px;
        display: flex;
        grid-area: header;

        @media (min-width: ${theme.screens.lg}) {
          margin: 0;
        }

        .credential-header-icon {
          width: 20px;
          height: 20px;
          transform: rotate(180deg);
          cursor: pointer;
          align-self: center;

          @media (min-width: ${theme.screens.lg}) {
            width: 30px;
            height: 30px;
          }

          & > svg {
            width: 20px;
            height: 20px;
            fill: ${theme.colors.white};

            @media (min-width: ${theme.screens.lg}) {
              width: 30px;
              height: 30px;
            }
          }
        }

        .credential-header-texts {
          margin-left: 12px;

          @media (min-width: ${theme.screens.lg}) {
            margin-left: 35px;
          }

          .credential-header-texts-title {
            margin: 0;
            font-family: 'HelveticaNowDisplay-Bold';
            font-size: ${theme.fonts.lg};
            color: ${theme.colors.white};
            margin-bottom: 4px;

            @media (min-width: ${theme.screens.lg}) {
              font-size: ${theme.fonts['2xl']};
              margin-bottom: 8px;
            }
          }

          .credential-header-texts-subtitle {
            margin: 0;
            font-size: ${theme.fonts.xs};
            color: ${theme.colors.white};

            @media (min-width: ${theme.screens.lg}) {
              font-size: ${theme.fonts.sm};
            }

            & > span {
              font-size: ${theme.fonts.xs};
              color: ${theme.colors.cyan};
              text-decoration: underline;

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts.sm};
              }
            }
          }
        }
      }

      .credential-card {
        grid-area: card;

        .credential-card-header {
          display: flex;
          margin-bottom: 14px;

          @media (min-width: ${theme.screens.lg}) {
            margin-bottom: 24px;
          }

          .credential-card-header-title {
            margin: 0;
            font-family: 'HelveticaNowDisplay-Bold';
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.white};

            @media (min-width: ${theme.screens.lg}) {
              font-size: ${theme.fonts.base};
            }

            & > span {
              font-size: ${theme.fonts.sm};
              color: ${theme.colors.white}B3;
              text-decoration: underline;

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts.base};
              }
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

      .credential-form-loading {
        display: grid;
        grid-gap: 24px;
        height: fit-content;
        margin-top: 60px;

        @media (min-width: ${theme.screens.lg}) {
          margin-top: 20px;
        }

        .credential-form-loading-animation {
          width: 60px;
          height: 60px;
          margin: 0 auto;
        }

        .credential-form-loading-text {
          margin: 0 auto;
          margin-top: 10px;
          font-size: ${theme.fonts.base};
          color: ${theme.colors.white};
        }
      }

      .credential-form {
        grid-area: form;
        margin-top: 50px;
        display: grid;
        grid-gap: 24px;
        height: fit-content;

        @media (min-width: ${theme.screens.lg}) {
          margin-top: 34px;
        }

        .credential-form-boxes {
          .credential-form-boxes-title {
            margin: 0;
            margin-bottom: 10px;
            font-family: 'HelveticaNowDisplay-Medium';
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.white}B3;

            @media (min-width: ${theme.screens.lg}) {
              font-size: ${theme.fonts.base};
            }
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
              cursor: pointer;

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
            cursor: pointer;

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

      .credential-form-html-input {
        cursor: pointer;
        height: 38px;
        display: flex;
        align-items: center;

        & > input {
          display: none;
        }

        .credential-form-html-input-label {
          display: flex;
          align-items: center;
          height: 100%;
          width: 100%;
          cursor: pointer;

          & > p {
            margin: 0;
            color: ${theme.colors.white}B3;
            font-size: ${theme.fonts.base};
            text-decoration: underline;
          }

          & > a {
            margin: 0;
            color: ${theme.colors.white}B3;
            font-size: ${theme.fonts.base};
            text-decoration: underline;
          }
        }
      }
    }

      .credential-issue-to {
        grid-area: issueTo;
        margin-top: 36px;

        @media (min-width: ${theme.screens.lg}) {
          margin-top: 60px;
        }

        .credential-issue-to-title {
          margin: 0;
          margin-bottom: 16px;
          font-size: ${theme.fonts.lg};
          color: ${theme.colors.white};

          @media (min-width: ${theme.screens.lg}) {
            font-size: ${theme.fonts.xl};
          }
        }

        .credential-issue-to-list {
          .credential-issue-to-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid ${theme.colors.white}80;
            padding: 10px 0;

            .credential-issue-to-item-text {
              margin: 0;
              color: ${theme.colors.white};
              font-size: ${theme.fonts.sm};

              @media (min-width: ${theme.screens.lg}) {
                font-size: ${theme.fonts.base};
              }
            }

            .credential-issue-to-item-close {
              width: 20px;
              height: 20px;

              & > svg {
                width: 20px;
                height: 20px;
                fill: ${theme.colors.white};
              }
            }
          }
        }

        .credential-issue-to-new-cred {
          display: flex;
          align-items: center;
          margin-top: 10px;
          cursor: pointer;

          .credential-issue-to-new-cred-icon {
            width: 33px;
            height: 33px;
            border: 1px solid ${theme.colors.white};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;

            & > svg {
              width: 20px;
              height: 20px;
              fill: ${theme.colors.white};
            }
          }

          .credential-issue-to-new-cred-text {
            margin: 0;
            margin-left: 10px;
            font-size: ${theme.fonts.base};
            color: ${theme.colors.white};

            @media (min-width: ${theme.screens.lg}) {
              font-size: ${theme.fonts.base};
            }
          }
        }
      }

      .credential-button {
        grid-area: button;
        height: 44px;
        width: 165px;
        margin-top: 48px;
        margin-left: auto;

        @media (min-width: ${theme.screens.lg}) {
          height: 50px;
          width: 213px;
          margin-top: 44px;
        }
      }
    }
  `}
`;

export const QuestionModalText = styled.div`
  ${({ theme }) => css`
    margin: 0;
    font-size: ${theme.fonts.base};
    color: ${theme.colors.white}B3;
    word-wrap: break-word;

    & > a {
      font-size: ${theme.fonts.base};
      color: ${theme.colors.white}B3;
      text-decoration: underline;
      word-wrap: break-word;
    }
  `}
`;

export const SuggestionBoxes = styled.div`
  ${({ theme }) => css`
    margin-top: 20px;

    .suggestion-boxes-text {
      margin: 0;
      margin-bottom: 10px;
      font-size: ${theme.fonts.sm};
      color: ${theme.colors.white};
    }

    .suggestion-boxes-container {
      max-width: 340px;
      overflow-x: auto;

      @media (min-width: ${theme.screens.lg}) {
        max-width: 577px;
        width: fit-content;
      }

      .suggestion-boxes {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 10px;

        .suggestion-box {
          border: 1px solid ${theme.colors.melrose};
          border-radius: 20px;
          padding: 4px 14px;
          height: 33px;
          width: max-content;
          cursor: pointer;
          display: flex;
          align-items: center;

          .suggestion-box-text {
            margin: 0;
            font-size: ${theme.fonts.sm};
            color: ${theme.colors.melrose};
          }
        }
      }
    }
  `}
`;
