import { useEffect, useState } from 'react';
import ShareModal from 'lit-share-modal-v3';

import { Wrapper } from './styles';
import { theme } from 'theme';

// types
import { ICredential } from 'utils/normalizeSchema';

interface IProps {
  currentPersonhood?: ICredential;
  onClose: () => void;
}

export const ShareWithModal = (props: IProps) => {
  const { currentPersonhood, onClose } = props;
  const [initialConditions, setInitialConditions] = useState([]);

  const onUnifiedAccessControlConditionsSelected = shareModalOutput => {
    console.log('shareModalOutput', shareModalOutput);
    console.log('currentPersonhood', currentPersonhood);
  };

  useEffect(() => {
    /*if (currentPersonhood){
      let accessControlConditions = await issuer.getEncryptedCredentialConditions(
        currentPersonhood.credential.id
      );
      setInitialConditions(accessControlConditions);
     */ 
    }
  }


  return (
    <>
      <style jsx global>{`
        .lsm-light-theme {
          --lsm-background-color: ${theme.colors.bunting} !important;
          --lsm-secondary-background-color: ${theme.colors.bunting} !important;
          --lsm-primary-color: ${theme.colors.white} !important;
          --lsm-border-radius: 14px !important;
          --lsm-contrast-color: ${theme.colors.white} !important;
          --lsm-accent-text: ${theme.colors.white} !important;
          --lsm-error-color: ${theme.colors.pomegranate} !important;
          --lsm-title-font: HelveticaNowDisplay-Medium !important;
          --lsm-title-font-weight: initial !important;
          --lsm-primary-font: HelveticaNowDisplay-Regular !important;
          --lsm-primary-font-weight: initial !important;

          // Default colors by lit component:
          --lsm-secondary-color: #c4c4c4;
          --lsm-modal-overlay-color: rgba(0, 0, 0, 0.4);
          --lsm-accent-color: rgb(36, 78, 112);
          --lsm-disabled-color: #aaa;
          --lsm-menu-focused-color: #2684ff;
        }
      `}</style>
      <Wrapper>
        <div className="share-with-modal-container">
          <ShareModal
            onClose={onClose}
            defaultChain={'mumbai'}
            chainOptions={['mumbai', 'polygon', 'ethereum', 'xdai']}
            defaultTokens={[
              {
                label: 'Krebit Credential',
                logo: 'https://gateway.pinata.cloud/ipfs/QmThGkNo3FcNrF3za1x5eqGpN99Dr9HXY6NkpQvMPArs8j/krebit-icon.png',
                value: '0xff9Edb48f006C4dF02853F90f9ce23078C0AeCD3',
                symbol: 'Krebit NFT',
                chain: 'polygon',
                standard: 'ERC1155'
              }
            ]}
            injectInitialState={true}
            initialUnifiedAccessControlConditions={
              currentPersonhood.accessControlConditions
            }
            onUnifiedAccessControlConditionsSelected={
              onUnifiedAccessControlConditionsSelected
            }
          />
        </div>
      </Wrapper>
    </>
  );
};
