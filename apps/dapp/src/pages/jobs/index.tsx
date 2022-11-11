import { NextPageContext } from 'next';

import { Layout, Jobs } from 'components';

// types
import { IJobProps } from 'components/Jobs';

const JobsPage = (props: IJobProps) => {
  const { jobId } = props;

  return (
    <Layout>
      <Jobs jobId={jobId} />
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      jobId: context?.query?.job_id || ''
    }
  };
}

export default JobsPage;
