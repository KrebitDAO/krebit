import React, { useEffect } from 'react';

interface IProps {
  ref: React.MutableRefObject<undefined | HTMLDivElement>;
  parentRef: React.MutableRefObject<undefined | HTMLDivElement>;
  handler: (event: MouseEvent) => void;
}

export const useOutsideClick = (props: IProps) => {
  const { ref, parentRef, handler } = props;

  useEffect(() => {
    const listener = (event: any) => {
      if (!parentRef.current || parentRef.current.contains(event.target)) {
        return;
      }

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
  }, [ref, parentRef, handler]);
};
