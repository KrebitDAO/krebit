import { getKrebitCredentialTypes } from '@krebitdao/eip712-vc';

const go = async () => {
  const response = getKrebitCredentialTypes();

  console.log(response);

  /* LitActions.setResponse({ response: JSON.stringify(response) }); */
};

go();
