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

  const onUnifiedAccessControlConditionsSelected = shareModalOutput => {
    console.log('shareModalOutput', shareModalOutput);
    console.log('currentPersonhood', currentPersonhood);
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
        <div className="share-with-modal-container">
          <ShareModal
            onClose={onClose}
            onUnifiedAccessControlConditionsSelected={
              onUnifiedAccessControlConditionsSelected
            }
          />
        </div>
      </Wrapper>
    </>
  );
};
