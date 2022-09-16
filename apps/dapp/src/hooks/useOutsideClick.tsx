import React, { useEffect } from 'react';

interface IProps {
  ref: React.MutableRefObject<undefined | HTMLDivElement>;
  handler: (event: MouseEvent) => void;
}

export function useOutsideClick(props: IProps) {
  const { ref, handler } = props;

  console.log(ref);

  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
