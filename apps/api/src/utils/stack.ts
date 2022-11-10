import 'isomorphic-fetch';

interface IProps {
  accessToken: string;
}

interface IGuilgProps extends IProps {
  guildId: string;
}

const { SERVER_STACK_API_URL } = process.env;
const { SERVER_STACK_APP_KEY } = process.env;

export const getStackUser = async (props: IProps) => {
  const { accessToken } = props;

  try {
    const response = await fetch(
      `${SERVER_STACK_API_URL}/me?order=desc&sort=reputation&site=stackoverflow&key=${SERVER_STACK_APP_KEY}&access_token=${accessToken}`
    ).then(result => result.json());

    console.log('getStackUser response:', response);
    if (response?.items?.length > 0) return response.items[0];
    else return null;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getTopTags = async (props: IProps) => {
  const { accessToken } = props;

  try {
    const response = await fetch(
      `${SERVER_STACK_API_URL}/me/top-answer-tags?site=stackoverflow&key=${SERVER_STACK_APP_KEY}&access_token=${accessToken}`
    ).then(result => result.json());

    console.log('getTopTags response:', response);
    //if (response?.items?.length > 0) return response.items[0];
    //else return null;

    return [
      {
        answer_count: 10,
        answer_score: 50,
        question_count: 5,
        question_score: 25,
        tag_name: 'other'
      },
      {
        answer_count: 11,
        answer_score: 50,
        question_count: 5,
        question_score: 25,
        tag_name: 'javascript'
      },
      {
        answer_count: 9,
        answer_score: 50,
        question_count: 5,
        question_score: 25,
        tag_name: 'solidity'
      }
    ];
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const stack = {
  getStackUser,
  getTopTags
};
