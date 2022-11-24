import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface IProps {
  iconColor?: string;
}

export const Wrapper = styled.div<IProps>`
  ${({ theme, iconColor }) => css`
    .MuiTypography-root {
      color: ${theme.colors.white};
      font-family: 'HelveticaNowDisplay-Regular';
      font-size: ${theme.fonts.base};
    }

    .MuiRating-root {
      padding: 0.5rem;
    }

    .Mui-disabled {
      color: ${theme.colors.white}80 !important;
    }

    & .MuiRating-iconEmpty {
      color: ${theme.colors.white};
    }

    .MuiRating-iconFilled {
      color: ${theme.colors[iconColor]};
    }
  `}
`;
