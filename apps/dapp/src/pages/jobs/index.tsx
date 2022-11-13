import { NextPageContext } from 'next';
import { Orbis } from '@orbisclub/orbis-sdk';

import { Layout, Jobs } from 'components';

// types
import { IJobProps } from 'components/Jobs';

const GROUP_ID =
  'kjzl6cwe1jw14ai2gg8e0qmx2j944ppe3s3dgfk003jlb8guuybyg4m77nsrg73';
const DEFAULT_CONTENT_VIEW = 'feed';
const orbis = new Orbis();

const JobsPage = (props: IJobProps) => {
  const { jobId, group, members } = props;

  return (
    <Layout>
      <Jobs jobId={jobId} group={group} members={members} />
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const jobId = context?.query?.job_id;

  const { data: group, error: groupError } = await orbis.getGroup(GROUP_ID);
  const { data: members, error: membersError } = await orbis.getGroupMembers(
    GROUP_ID
  );

  if (groupError || membersError) {
    console.error('groupError', groupError);
    console.error('membersError', membersError);
    return {
      props: {}
    };
  }

  let currentView = DEFAULT_CONTENT_VIEW;

  const view = group?.channels?.find(channel => channel?.stream_id === jobId);
  currentView = view?.content?.type || DEFAULT_CONTENT_VIEW;

  return {
    props: {
      jobId: jobId || '',
      group: {
        ...group,
        currentView
      },
      members: members || []
    }
  };
}

export default JobsPage;
