import { useRef } from 'react';

import { Wrapper } from './styles';
import { useOutsideClick } from 'hooks';

interface IProps {
  items: {
    title: string;
    onClick: () => void;
  }[];
  onClose: () => void;
}

export const InlineDropdown = (props: IProps) => {
  const { items, onClose } = props;
  const ref = useRef(null);
  useOutsideClick({ ref, handler: onClose });

  return (
    <Wrapper ref={ref}>
      {items
        .filter(item => item !== undefined)
        .map((item, index) => (
          <button
            className="inline-dropdown-item"
            key={index}
            onClick={item.onClick}
          >
            {item.title}
          </button>
        ))}
    </Wrapper>
  );
};
