import { css, Global } from '@emotion/react';

export const globalStyles = (
  <Global
    styles={css`
      @font-face {
        font-family: 'HelveticaNowDisplay-Bold';
        src: local('HelveticaNowDisplay-Bold'),
          local('HelveticaNowDisplay-Bold'),
          url('/fonts/HelveticaNowDisplay-Bold.otf') format('opentype');
        font-display: swap;
      }

      @font-face {
        font-family: 'HelveticaNowDisplay-Medium';
        src: local('HelveticaNowDisplay-Medium'),
          local('HelveticaNowDisplay-Medium'),
          url('/fonts/HelveticaNowDisplay-Medium.otf') format('opentype');
        font-display: swap;
      }

      @font-face {
        font-family: 'HelveticaNowDisplay-Regular';
        src: local('HelveticaNowDisplay-Regular'),
          local('HelveticaNowDisplay-Regular'),
          url('/fonts/HelveticaNowDisplay-Regular.otf') format('opentype');
        font-display: swap;
      }

      * {
        font-family: 'HelveticaNowDisplay-Regular', sans-serif;
        box-sizing: border-box;
        font-weight: 300;
      }

      html,
      body {
        scroll-behavior: smooth;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        background-image: linear-gradient(
          to right bottom,
          #50ffff,
          #00e9ff,
          #00d1ff,
          #78d7ff,
          #cee5ff,
          #e9efff,
          #e3e5fd,
          #e1dffc,
          #c7c8fb,
          #859df8,
          #538af7,
          #7a79ea,
          #9765d8,
          #b45bcf,
          #cd50c2,
          #e244b2,
          #f3389f
        );

        @media (min-width: 1024px) {
        }
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: initial;
        margin: 0;
        padding: 0;
      }

      a {
        text-decoration: none;
      }

      .fade-enter {
        opacity: 0;
      }

      .fade-exit {
        opacity: 1;
      }

      .fade-enter-active {
        opacity: 1;
      }

      .fade-exit-active {
        opacity: 0;
      }

      .fade-enter-active,
      .fade-exit-active {
        transition: opacity 0.6s;
      }
    `}
  />
);
