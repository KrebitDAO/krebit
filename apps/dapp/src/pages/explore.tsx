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
  const tab = parseInt(context.query?.tab as string, 10);

  return {
    props: {
      query: {
        tab: tab >= 0 && tab <= initialSearchTypes?.length - 1 ? tab : null,
        skill: context?.query?.skill || null
      }
    }
  };
}

export default ExplorePage;
