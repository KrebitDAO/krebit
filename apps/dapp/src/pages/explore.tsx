import { Layout, Explorer } from 'components';
import { initialSearchTypes, IProps } from 'components/Explorer';

// types
import { NextPageContext } from 'next';

const ExplorePage = (props: IProps) => {
  return (
    <Layout>
      <Explorer {...props} />
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const tab = initialSearchTypes.findIndex(
    values => values.value === context?.query?.tab
  );

  return {
    props: {
      query: {
        tab: tab !== -1 ? tab : null,
        skill: context?.query?.skill || null
      }
    }
  };
}

export default ExplorePage;
