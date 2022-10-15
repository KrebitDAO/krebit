import { FunctionComponent, MouseEvent, useContext, useState } from 'react';

import { Wrapper, WalletButton } from './styles';
import { Close } from 'components/Icons';
import { Loading } from 'components/Loading';
import { GeneralContext } from 'context';

interface IProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ConnectWallet: FunctionComponent<IProps> = props => {
  const { isOpen = false, onClose } = props;
  const [status, setStatus] = useState('idle');
  const {
    auth: { connect }
  } = useContext(GeneralContext);

  const handlerConnect = async (type: string) => {
    setStatus('pending');

    await connect(type);
    onClose();
  };

  if (!isOpen) return;

  return (
    <Wrapper status={status}>
      <div className="wallet">
        {status === 'pending' ? (
          <>
            <p className="loading-title">
              Connecting to decentralized identity
            </p>
            <div className="loading-view">
              <div className="loading-view-container">
                <Loading />
              </div>
              <p className="loading-view-text">Authorizing your wallet</p>
            </div>
          </>
        ) : (
          <>
            <div className="wallet-header">
              <p className="wallet-header-title">Connect your Wallet</p>
              <div className="wallet-header-close" onClick={onClose}>
                <Close />
              </div>
            </div>
            <div className="wallet-buttons">
              <WalletButton
                textColor="tango"
                onClick={() => handlerConnect('metamask')}
              >
                <img src="/imgs/logos/metamask.png" width={24} height={24} />{' '}
                Metamask
              </WalletButton>
              {/* <WalletButton
                textColor="white"
                onClick={() => handlerConnect('wallet_connect')}
              >
                <img
                  src="/imgs/logos/wallet-connect.png"
                  width={30}
                  height={24}
                />{' '}
                WalletConnect
              </WalletButton> */}
            </div>
            <a
              className="wallet-read"
              href="https://metamask.io/download/"
              target="_blank"
            >
              I don't have a wallet
            </a>
          </>
        )}
      </div>
    </Wrapper>
  );
};
