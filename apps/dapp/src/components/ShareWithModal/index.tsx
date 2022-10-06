import { useEffect, useState } from 'react';
import ShareModal from 'lit-share-modal-v3';
import { ethers } from 'ethers';
import { Wrapper } from './styles';
import { theme } from 'theme';

import krebitNFT from '@krebitdao/reputation-passport/dist/schemas/krebitNFT.json';

// types
import { ICredential } from 'utils/normalizeSchema';
import { Krebit as Issuer } from '@krebitdao/reputation-passport/dist/core/Krebit';

interface IProps {
  currentPersonhood?: ICredential;
  issuer: Issuer;
  onClose: () => void;
}

export const ShareWithModal = (props: IProps) => {
  const { currentPersonhood, issuer, onClose } = props;
  const [status, setStatus] = useState('idle');
  const [initialConditions, setInitialConditions] = useState([]);

  useEffect(() => {
    try {
      setStatus('pending');

      const getEncryptedCredentialConditions = async () => {
        const accessControlConditions =
          await issuer.getEncryptedCredentialConditions(
            currentPersonhood.credential.id
          );

        setInitialConditions(accessControlConditions);
        setStatus('resolved');
      };

      if (currentPersonhood) {
        getEncryptedCredentialConditions();
      }
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  }, [currentPersonhood, issuer]);

  const onUnifiedAccessControlConditionsSelected = async shareModalOutput => {
    try {
      setStatus('pending');
      console.log('shareModalOutput', shareModalOutput);
      console.log('currentPersonhood', currentPersonhood);

      const newConditions = shareModalOutput.unifiedAccessControlConditions.map(
        condition => {
          if (
            condition.contractAddress ===
              krebitNFT[process.env.NEXT_PUBLIC_NETWORK]?.address &&
            isNaN(Number(condition.parameters[1]))
          ) {
            const tokenIdHex = ethers.utils.keccak256(
              ethers.utils.defaultAbiCoder.encode(
                ['string'],
                [condition.parameters[1]]
              )
            );
            const tokenId = ethers.BigNumber.from(tokenIdHex);
            const newParameters = [condition.parameters[0], tokenId.toString()];
            return { ...condition, parameters: newParameters };
          } else {
            return condition;
          }
        }
      );
      console.log('newConditions', newConditions);
      await issuer.shareEncryptedCredentialWith(
        currentPersonhood.credential.id,
        shareModalOutput.unifiedAccessControlConditions
      );
      setStatus('resolved');
      onClose();
    } catch (error) {
      console.error(error);
      setStatus('rejected');
    }
  };

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
        {/* TODO: ADD LOADING VIEW... */}
        {status === 'pending' ? (
          <h1>loading...</h1>
        ) : (
          <div className="share-with-modal-container">
            <ShareModal
              onClose={onClose}
              defaultChain={'mumbai'}
              chainOptions={['mumbai', 'polygon', 'ethereum', 'xdai']}
              defaultTokens={[
                {
                  label: 'Krebit Credential',
                  logo: 'https://gateway.pinata.cloud/ipfs/QmThGkNo3FcNrF3za1x5eqGpN99Dr9HXY6NkpQvMPArs8j/krebit-icon.png',
                  value: krebitNFT[process.env.NEXT_PUBLIC_NETWORK]?.address,
                  symbol: 'Krebit NFT',
                  chain: 'polygon',
                  standard: 'ERC1155'
                }
              ]}
              injectInitialState={true}
              initialUnifiedAccessControlConditions={initialConditions}
              onUnifiedAccessControlConditionsSelected={
                onUnifiedAccessControlConditionsSelected
              }
            />
          </div>
        )}
      </Wrapper>
    </>
  );
};
