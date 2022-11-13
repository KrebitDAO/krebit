import { NextPageContext } from 'next';
import { Orbis } from '@orbisclub/orbis-sdk';

import { Layout, Jobs } from 'components';
import { constants } from 'utils';

// types
import { IJobProps } from 'components/Jobs';

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

  const { data: group, error: groupError } = await orbis.getGroup(
    constants.DEFAULT_GROUP_ID
  );
  const { data: members, error: membersError } = await orbis.getGroupMembers(
    constants.DEFAULT_GROUP_ID
  );

  if (groupError || membersError) {
    console.error('groupError', groupError);
    console.error('membersError', membersError);
    return {
      props: {}
    };
  }

  let currentView = constants.DEFAULT_GROUP_CONTENT_VIEW;

  const view = group?.channels?.find(channel => channel?.stream_id === jobId);
  currentView = view?.content?.type || constants.DEFAULT_GROUP_CONTENT_VIEW;

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
