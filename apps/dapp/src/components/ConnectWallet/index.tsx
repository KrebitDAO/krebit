import { FunctionComponent, useContext, useState } from 'react';

import { Wrapper, WalletButton } from './styles';
import { Close } from 'components/Icons';
import { Loading } from 'components/Loading';
import { Checkbox } from 'components/Checkbox';
import { GeneralContext } from 'context';

interface IProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ConnectWallet: FunctionComponent<IProps> = props => {
  const { isOpen = false, onClose } = props;
  const [status, setStatus] = useState('idle');
  const [shouldRememberSession, setShouldRememberSession] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true);
  const {
    auth: { connect, handleRememberSession }
  } = useContext(GeneralContext);

  const handleConnect = async (type: string) => {
    try {
      setStatus('pending');

      if (!shouldRememberSession) {
        handleRememberSession();
      }

      await connect(type);
      onClose();
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

  const handleShouldRememberSession = () => {
    setShouldRememberSession(prevValue => !prevValue);
  };

  const handleHasAcceptedTerms = () => {
    setHasAcceptedTerms(prevValue => !prevValue);
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
                disabled={!hasAcceptedTerms}
                onClick={() => handleConnect('metamask')}
              >
                <img src="/imgs/logos/metamask.png" width={24} height={24} />{' '}
                Metamask
              </WalletButton>
              <WalletButton
                textColor="white"
                disabled={!hasAcceptedTerms}
                onClick={() => handleConnect('wallet_connect')}
              >
                <img
                  src="/imgs/logos/wallet-connect.png"
                  width={30}
                  height={24}
                />{' '}
                WalletConnect
              </WalletButton>
            </div>
            <div className="wallet-remember-session">
              <Checkbox
                placeholder="Remember session"
                name="remember"
                value={shouldRememberSession}
                onChange={handleShouldRememberSession}
              />
            </div>
            <div className="wallet-terms">
              <Checkbox
                placeholder=""
                name="tems"
                value={hasAcceptedTerms}
                onChange={handleHasAcceptedTerms}
              />
              <p className="wallet-terms-text">
                I have read and accept the{' '}
                <a className="wallet-terms-text-link" href="/terms">
                  terms
                </a>{' '}
                and{' '}
                <a className="wallet-terms-text-link" href="/privacy">
                  privacy policy
                </a>
                .
              </p>
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
