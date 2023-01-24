import { useContext, useEffect, useState } from 'react';

import { Verify } from 'components/Verify';
import { formatCredential } from './formatCredential';
import { getIssuers } from 'utils';
import { GeneralContext } from 'context';
import { useIssuerProvider } from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  isAuthenticated: boolean;
  credential: ICredential;
  onClose: () => void;
  readOnly?: boolean;
}

export const VerifyCredential = (props: IProps) => {
  const { isAuthenticated, credential, onClose, readOnly = true } = props;
  const [customCredential, setCustomCredential] = useState<ICredential>();
  const { walletInformation } = useContext(GeneralContext);
  const issuerProvider = useIssuerProvider({
    walletInformation
  });

  useEffect(() => {
    const title = formatCredential(credential.credential, 'title');
    const description = formatCredential(credential.credential, 'description');
    const image = formatCredential(credential.credential, 'image');

    setCustomCredential({
      ...credential,
      credential: {
        ...credential?.credential,
        visualInformation: {
          ...credential?.credential?.visualInformation,
          metadata: {
            title,
            description,
            image
          }
        }
      }
    });
  }, []);

  const getProvider = (credentialType: string) => {
    if (credentialType === 'Issuer') {
      return issuerProvider;
    }
  };

  const handleClose = async () => {
    onClose();
  };

  const handleCleanState = (credentialType: string) => {
    const provider = getProvider(credentialType);

    provider.handleCleanClaimValues();
  };

  return (
    <Verify
      initialList={getIssuers('Community')}
      onClose={handleClose}
      onClean={handleCleanState}
      verifyId={credential?.credential?.credentialType}
      credential={customCredential}
      getProvider={getProvider}
      isAuthenticated={isAuthenticated}
      walletInformation={walletInformation}
      readOnly={readOnly}
      formatCredentialName={() => undefined} // This is not necessary for this unique use case
      formatLitValue={async () => {}} // This is not necessary for this unique use case
      updateCredential={async () => {}} // This is not necessary for this unique use case
    />
  );
};
