import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const CircularProgressWrapper = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 100%;
    overflow: hidden;

    & > .MuiCircularProgress-root {
      width: 100% !important;
      height: 100% !important;
    }
  `}
`;

export const SkeletonWrapper = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 100%;

    & > .MuiSkeleton-root {
      width: 100% !important;
      height: 100% !important;
      transform: initial !important;
      border-radius: 15px;
    }
  `}
`;
