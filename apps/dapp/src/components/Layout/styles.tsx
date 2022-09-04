import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface INavBarOptionProps {
  isActive: boolean;
}

export const Wrapper = styled.div`
  ${({ theme }) => css``}
`;

export const MenuMobile = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 56px;
    padding: 13px 30px;
    display: flex;
    justify-content: space-between;
    position: relative;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;

    .icon svg {
      width: 30px;
      height: 30px;
      fill: ${theme.colors.white};
    }

    .photo {
      border: 2px solid ${theme.colors.white};
      border-radius: 9999px;
      width: 30px;
      height: 30px;

      img {
        border-radius: 9999px;
      }
    }

    @media (min-width: ${theme.screens.lg}) {
      display: none;
    }
  `}
`;

export const NavBarMobile = styled.div`
  ${({ theme }) => css`
    width: 95%;
    background-color: ${theme.colors.white}0D;
    backdrop-filter: blur(40px);
    border-radius: 15px;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    margin: 0 auto;
    margin-bottom: 18px;
    padding: 14px 31px;
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(4, minmax(auto, 76px));
    grid-gap: 28px;

    @media (min-width: ${theme.screens.lg}) {
      display: none;
    }
  `}
`;

export const NavBarDesktop = styled.div`
  ${({ theme }) => css`
    display: none;

    @media (min-width: ${theme.screens.lg}) {
      display: block;
      height: 95%;
      background-color: ${theme.colors.white}0D;
      backdrop-filter: blur(40px);
      border-radius: 15px;
      position: fixed;
      top: 20px;
      left: 0;
      z-index: 10;
      margin-left: 16px;
      padding: 24px 14px;

      .options {
        display: grid;
        grid-gap: 40px;
        grid-template-rows: repeat(5, auto);
        justify-items: center;

        .option-logo {
          width: 50px;
          height: 50px;
        }
      }

      .option-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        bottom: 24px;
        right: 0;
        left: 0;
        cursor: pointer;

        .profile {
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          border: 2px solid ${theme.colors.white};

          img {
            border-radius: 9999px;
          }
        }

        .profile-text {
          font-size: ${theme.fonts.sm};
          margin: 0;
          margin-top: 12px;
          color: ${theme.colors.gray};
        }
      }
    }
  `}
`;

export const NavBarOption = styled.div<INavBarOptionProps>`
  ${({ theme, isActive }) => css`
    height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-gap: 5px;
    cursor: pointer;

    .option-icon {
      width: 30px;
      height: 30px;

      & > svg {
        width: 30px;
        height: 30px;
        fill: ${isActive ? theme.colors.cyan : theme.colors.gray};

        & > path {
          fill: ${isActive ? theme.colors.cyan : theme.colors.gray};
        }
      }
    }

    .option-title {
      font-size: ${theme.fonts.sm};
      margin: 0 auto;
      color: ${isActive ? theme.colors.cyan : theme.colors.gray};
    }
  `}
`;
