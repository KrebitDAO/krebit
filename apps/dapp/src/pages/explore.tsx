import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Layout } from 'components';

export const Wrapper = styled.div`
  ${({ theme }) => css`
    .header {
      padding: 0 20px;

      .header-title {
        margin: 20px 0;
        text-align: center;
        font-size: ${theme.fonts.base};
        color: ${theme.colors.white};

        @media (min-width: ${theme.screens.lg}) {
          margin: 20px 0;
          margin-top: 60px;
          font-size: ${theme.fonts.xl};
        }
      }
    }
  `}
`;

const ExplorePage = () => {
  return (
    <Layout>
      <Wrapper>
        <div className="header">
          <h1 className="header-title">
            The Explore is going to be avaible very soon!
          </h1>
        </div>
      </Wrapper>
    </Layout>
  );
};

export default ExplorePage;
