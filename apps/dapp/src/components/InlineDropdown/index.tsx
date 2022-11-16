import React, { useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';

import { Wrapper } from './styles';

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
  useOnClickOutside(ref, onClose);

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
