import { useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';

import { Wrapper } from './styles';
import { constants } from 'utils';

interface IProps {
  customText: string;
  onClose: () => void;
}

export const ShareContentModal = (props: IProps) => {
  const { customText, onClose } = props;
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);

  const handleSocialNetworkAction = async (id: string) => {
    const currentUrl = window.location.href;
    let url: string;

    if (id === 'twitter') {
      url = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${customText}&hashtags=krebit%2CWeb3Identity%2CWeb3Reputation%2Cethereum%2Cpolygon`;
    }

    if (id === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    }

    if (id === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
    }

    if (id === 'telegram') {
      url = `https://telegram.me/share/url?url=${currentUrl}&text=${customText}`;
    }

    if (id === 'whatsapp') {
      url = `https://wa.me/?text=${customText}%20${currentUrl}`;
    }

    window.open(url, '_blank');
    onClose();
  };

  return (
    <Wrapper ref={ref}>
      <p className="share-content-title">Share a link to this page</p>
      <div className="share-content-container">
        {constants.DEFAULT_SHARE_CONTENT_SOCIAL_NETWORKS.map((item, index) => (
          <div
            className="share-content-container-element"
            key={index}
            onClick={() => handleSocialNetworkAction(item.id)}
          >
            <div className="share-content-container-icon">{item.icon}</div>
            <p className="share-content-container-element-text">{item.text}</p>
          </div>
        ))}
      </div>
    </Wrapper>
  );
};
