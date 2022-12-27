import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.SERVER_OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export const getSkillSummary = async (skills: string[]) => {
  try {
    const response = await openai
      .createCompletion({
        model: process.env.SERVER_OPENAI_MODEL,
        prompt: `Generate an english, 2 sentence, natural language description of a Krebiter that has the following verifiable credentials: ${skills.join(
          ', '
        )}`,
        temperature: 0.6,
        max_tokens: 300
      })
      .then(completion => completion.data.choices[0].text);

    console.log('completion:', response);

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getJobSummary = async (job: string) => {
  try {
    const response = await openai
      .createCompletion({
        model: process.env.SERVER_OPENAI_MODEL,
        prompt: `Generate an english, 3 sentence, natural language summary of the following job description:\n\n\n ${job}`,
        max_tokens: 300
      })
      .then(completion => completion.data.choices[0].text);

    console.log('completion:', response);

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getMatch = async (job: string, skills: string[]) => {
  try {
    const response = await openai
      .createCompletion({
        model: process.env.SERVER_OPENAI_MODEL,
        prompt: `If I have the following credentials: ${skills.join(
          ', '
        )}, then what is the match percentage from 0 to 100% that can I apply to the following job? (just tell me the number):\n\n\n ${job}`,
        temperature: 0.6,
        max_tokens: 300
      })
      .then(completion => completion.data.choices[0].text);

    console.log('completion:', response);

    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const openAI = {
  getSkillSummary,
  getMatch,
  getJobSummary
};
