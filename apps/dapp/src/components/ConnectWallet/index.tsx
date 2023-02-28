import { FunctionComponent, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { Wrapper, WalletButton } from './styles';
import { Close } from 'components/Icons';
import { Loading } from 'components/Loading';
import { Checkbox } from 'components/Checkbox';
import { Login } from 'components/Icons';
import { GeneralContext } from 'context';
import ConnectWalletText from './index.text.json';

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
  const { locale } = useRouter();

  const handleConnect = async (type: string) => {
    try {
      setStatus('pending');

      if (!shouldRememberSession) {
        handleRememberSession();
      }

      const data = await connect(type);

      if (data) {
        setStatus('resolved');
        onClose();
      }
    } catch (error) {
      console.error('connect wallet function error: ', error);
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
    <>
      <style jsx global>{`
        #w3a-modal {
          z-index: 40;
        }
      `}</style>
      <Wrapper status={status}>
        <div className="wallet">
          {status === 'pending' ? (
            <>
              <p className="loading-title">
                {ConnectWalletText[locale]['loading-title']}
              </p>
              <div className="loading-view">
                <div className="loading-view-container">
                  <Loading />
                </div>
                <p className="loading-view-text">
                  {ConnectWalletText[locale]['loading-view-text']}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="wallet-header">
                <p className="wallet-header-title">
                  {ConnectWalletText[locale]['wallet-header-title']}
                </p>
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
                  {ConnectWalletText[locale]['wallet-buttons'][0]}
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
                  {ConnectWalletText[locale]['wallet-buttons'][1]}
                </WalletButton>
                <WalletButton
                  textColor="periwinkle"
                  disabled={!hasAcceptedTerms}
                  onClick={() => handleConnect('web3auth')}
                >
                  <Login /> {ConnectWalletText[locale]['wallet-buttons'][2]}
                </WalletButton>
              </div>
              <div className="wallet-remember-session">
                <Checkbox
                  placeholder={
                    ConnectWalletText[locale]['wallet-remember-session']
                  }
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
                  {ConnectWalletText[locale]['wallet-terms-text'][0]}{' '}
                  <a className="wallet-terms-text-link" href="/terms">
                    {ConnectWalletText[locale]['wallet-terms-text'][1]}
                  </a>{' '}
                  {ConnectWalletText[locale]['wallet-terms-text'][2]}{' '}
                  <a className="wallet-terms-text-link" href="/privacy">
                    {ConnectWalletText[locale]['wallet-terms-text'][3]}
                  </a>
                  .
                </p>
              </div>
              <a
                className="wallet-read"
                href="https://metamask.io/download/"
                target="_blank"
              >
                {ConnectWalletText[locale]['wallet-read']}
              </a>
            </>
          )}
        </div>
      </Wrapper>
    </>
  );
};
