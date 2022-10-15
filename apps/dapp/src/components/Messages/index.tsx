import { useContext } from 'react';
import { useRouter } from 'next/router';

import { LoadingWrapper, Wrapper } from './styles';
import { Loading } from 'components/Loading';
import { Button } from 'components/Button';
import { ConnectWallet } from 'components/ConnectWallet';
import { GeneralContext } from 'context';

export const Messages = () => {
  const { query } = useRouter();
  const {
    auth,
    walletInformation: { orbis },
    walletModal: { openConnectWallet, handleOpenConnectWallet }
  } = useContext(GeneralContext);

  const TEMPORAL_orbisLink = () => {
    window.open('https://app.orbis.club/', '_blank');
  };

  if (auth?.status === 'pending') {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }

  if (!auth?.isAuthenticated) {
    return (
      <LoadingWrapper>
        <ConnectWallet
          isOpen={openConnectWallet}
          onClose={handleOpenConnectWallet}
        />
        <div className="button">
          <Button text="Connect wallet" onClick={handleOpenConnectWallet} />
        </div>
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper>
      <div className="messages-header">
        <h1 className="messages-header-title">
          The chat is going to be avaible very soon! For now you can try Orbis
        </h1>
        <div className="messages-header-button">
          <Button text="Try orbis" onClick={TEMPORAL_orbisLink} />
        </div>
      </div>
    </Wrapper>
  );
};
