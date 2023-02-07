import { useContext } from 'react';

import { Verify } from 'components/Verify';
import { getIssuers } from 'utils';
import { GeneralContext } from 'context';
import { useIssuerProvider } from 'hooks';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  isAuthenticated: boolean;
  credential: ICredential;
  onClose: () => void;
  getInformation?: () => Promise<void>;
  updateCredential?: (vcId: string) => Promise<void>;
  readOnly?: boolean;
}

export const VerifyCredential = (props: IProps) => {
  const {
    isAuthenticated,
    credential,
    onClose,
    getInformation,
    updateCredential,
    readOnly = true
  } = props;
  const { walletInformation } = useContext(GeneralContext);
  const issuerProvider = useIssuerProvider({
    walletInformation
  });

  const getProvider = (credentialType: string) => {
    if (credentialType === 'Issuer') {
      return issuerProvider;
    }
  };

  const handleClose = async () => {
    if (getInformation) {
      await getInformation().then(() => {
        onClose();
      });
    } else {
      onClose();
    }
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
      verifyId={
        credential?.credential?.credentialType ||
        credential?.credential?.visualInformation?.credentialType
      }
      credential={credential}
      getProvider={getProvider}
      isAuthenticated={isAuthenticated}
      walletInformation={walletInformation}
      readOnly={readOnly}
      updateCredential={updateCredential}
      formatCredentialName={undefined} // This is not necessary for this unique use case
      formatLitValue={async () => {}} // This is not necessary for this unique use case
    />
  );
};
