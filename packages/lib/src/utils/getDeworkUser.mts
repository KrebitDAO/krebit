const DEWORK_URL = 'https://api.deworkxyz.com/v1/reputation';

export const getDeworkUser = async (address: string) => {
  try {
    const response = await fetch(`${DEWORK_URL}/${address}`).then(result =>
      result.json()
    );
    return response;
  } catch (error) {
    console.error(error);

    return null;
  }
};
