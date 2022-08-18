import { FunctionComponent, MouseEventHandler } from 'react';

import { Wrapper } from './styles';

interface Props {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  primaryColor?: string;
  secondaryColor?: string;
}

export const Button: FunctionComponent<Props> = props => {
  const {
    text,
    onClick,
    primaryColor = 'heliotrope',
    secondaryColor = 'cyan'
  } = props;

  return (
    <Wrapper
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      onClick={onClick}
    >
      {text}
    </Wrapper>
  );
};
