import { FunctionComponent, MouseEventHandler } from 'react';

import { Wrapper } from './styles';

interface Props {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  styleType?: 'background' | 'border';
  primaryColor?: string;
  secondaryColor?: string;
}

export const Button: FunctionComponent<Props> = props => {
  const {
    text,
    onClick,
    styleType = 'background',
    primaryColor = 'heliotrope',
    secondaryColor = 'cyan'
  } = props;

  return (
    <Wrapper
      styleType={styleType}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      onClick={onClick}
    >
      {text}
    </Wrapper>
  );
};
