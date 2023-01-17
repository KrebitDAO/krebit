import { Orbis } from '@orbisclub/orbis-sdk';

import { Layout, Groups } from 'components';
import { constants } from 'utils';

// types
import { NextPageContext } from 'next';
import { IGroupProps } from 'components/Groups';

const orbis = new Orbis();

const PostsPage = (props: IGroupProps) => {
  const { channelId, postId, group, members } = props;

  return (
    <Layout>
      <Groups
        channelId={channelId}
        postId={postId}
        group={group}
        members={members}
      />
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const channelId = context?.query?.channel_id;
  const postId = context?.query?.post_id;

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

  const view = group?.channels?.find(
    channel => channel?.stream_id === channelId
  );
  currentView = view?.content?.type || constants.DEFAULT_GROUP_CONTENT_VIEW;

  return {
    props: {
      channelId: channelId || '',
      postId: postId || '',
      group: {
        ...group,
        currentView
      },
      members: members || []
    }
  };
}

export default PostsPage;
