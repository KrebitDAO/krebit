import { MouseEvent, ReactNode, useState } from 'react';
import { useSpring } from '@react-spring/web';

import { Card, CardContainer } from './styles';

export interface ICardProps {
  primaryColor: string;
  secondaryColor: string;
  smaller?: boolean;
  frontChildren?: ReactNode;
  backChildren?: ReactNode;
}

export const CredentialCard = (props: ICardProps) => {
  const [flipped, setFlipped] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  const handleFlipped = (event: MouseEvent<HTMLDivElement>) => {
    const hasNotParentClick = (event.target as any).getAttribute(
      'data-not-parent-click'
    );

    if (hasNotParentClick) return;

    setFlipped(prevValue => !prevValue);
  };

  return (
    <CardContainer onClick={handleFlipped}>
      <Card
        {...props}
        style={{
          opacity: opacity.to(o => 1 - o),
          transform,
          zIndex: !flipped ? 10 : 0
        }}
      >
        {props.frontChildren}
      </Card>
      <Card
        {...props}
        style={{
          opacity,
          transform,
          rotateY: '180deg',
          zIndex: flipped ? 10 : 0
        }}
      >
        {props.backChildren}
      </Card>
    </CardContainer>
  );
};
