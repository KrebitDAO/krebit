import 'isomorphic-fetch';

const { SERVER_PERSONA_API_URL, SERVER_PERSONA_PRIVATE_KEY } = process.env;

export const getPersonaDecision = async (inquiryId: string): Promise<any> => {
  try {
    const response = await fetch(
      `${SERVER_PERSONA_API_URL}/inquiries/${inquiryId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Persona-Version': '2022-09-01',
          Authorization: `Bearer ${SERVER_PERSONA_PRIVATE_KEY}`
        }
      }
    ).then(result => result.json());

    const verification = response.included.filter(obj => {
      return obj.type === 'verification/government-id';
    });
    return verification[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};
