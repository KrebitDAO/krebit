import 'isomorphic-fetch';

export const getSkillSummary = async (skills: String[]) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skills
      })
    }).then(result => result.json());

    return response?.result;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getMatch = async (jobId: string, did: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId,
        did
      })
    }).then(result => result.json());

    return response?.result;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const openAI = {
  getSkillSummary,
  getMatch
};
