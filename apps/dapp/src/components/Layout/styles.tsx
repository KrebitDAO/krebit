import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface INavBarOptionProps {
  isActive: boolean;
}

interface IMenuProps {
  profilePicture: string;
}

export const Wrapper = styled.div`
  ${({ theme }) => css``}
`;

export const MenuMobile = styled.div<IMenuProps>`
  ${({ theme, profilePicture }) => css`
    width: 100%;
    height: 56px;
    padding: 13px 20px;
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

    .profile-menu {
      position: relative;
      display: flex;
      grid-gap: 20px;

      .profile-menu-image {
        border: 2px solid ${theme.colors.white};
        border-radius: 9999px;
        width: 30px;
        height: 30px;
        background-image: url('${profilePicture}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .profile-menu-dropdown {
        position: absolute;
        top: 38px;
        right: 0px;
        z-index: 10;
      }

      .profile-menu-icon {
        width: 30px;
        height: 30px;

        & > svg {
          width: 30px;
          height: 30px;
          fill: ${theme.colors.white};
        }
      }
    }

    @media (min-width: ${theme.screens.lg}) {
      display: none;
    }
  `}
`;

export const MenuContentMobile = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: calc(100% - 56px);
    position: fixed;
    top: 56px;
    right: 0;
    left: 0;
    z-index: 20;
    background-color: ${theme.colors.ebony};

    @media (min-width: ${theme.screens.lg}) {
      display: none;
    }

    .menu-content-mobile {
      padding: 0 20px;

      .menu-content-mobile-item {
        display: block;
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.xl};
        color: ${theme.colors.white};
        margin: 0;
        margin-top: 27px;

        &:first-of-type {
          margin-top: 33px;
        }
      }
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
    grid-template-columns: repeat(3, minmax(auto, 76px));
    grid-gap: 28px;

    @media (min-width: ${theme.screens.lg}) {
      display: none;
    }
  `}
`;

export const NavBarDesktop = styled.div<IMenuProps>`
  ${({ theme, profilePicture }) => css`
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
        grid-gap: 46px;
        grid-template-rows: repeat(5, auto);
        justify-items: center;
      }

      .option-profile-container {
        position: absolute;
        bottom: 43px;
        display: grid;
        grid-gap: 46px;
        grid-template-rows: repeat(2, auto);
        justify-items: center;
        width: 40px;

        .option-profile {
          position: relative;

          .option-profile-image {
            cursor: pointer;
            border: 2px solid ${theme.colors.white};
            border-radius: 9999px;
            width: 34px;
            height: 34px;
            background-image: url('${profilePicture}');
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }

          .option-profile-dropdown {
            position: absolute;
            top: -68px;
            left: 46px;
            z-index: 10;
          }
        }
      }
    }
  `}
`;

export const NavBarOption = styled.div<INavBarOptionProps>`
  ${({ theme, isActive }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-gap: 5px;
    cursor: pointer;
    position: relative;

    .option-icon {
      width: 30px;
      height: 30px;

      & > svg {
        width: 30px;
        height: 30px;
        fill: ${isActive ? theme.colors.cyan : theme.colors.gray};

        & > g > path {
          fill: ${isActive ? theme.colors.cyan : theme.colors.gray};
        }
      }
    }

    .option-hover {
      display: none;

      @media (min-width: ${theme.screens.lg}) {
        display: block;
        margin: 0;
        position: absolute;
        top: 0;
        left: 40px;
        padding: 8px;
        border-radius: 5px;
        background-color: ${theme.colors.ebonyClay};
        color: ${theme.colors.white};
        font-family: 'HelveticaNowDisplay-Medium';
        font-size: ${theme.fonts.xs};
        box-shadow: ${theme.shadows.small};
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  `}
`;
