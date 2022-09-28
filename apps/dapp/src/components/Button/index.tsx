import { FunctionComponent, MouseEventHandler } from 'react';

import { Wrapper } from './styles';

interface Props {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  styleType?: 'background' | 'border';
  primaryColor?: string;
  secondaryColor?: string;
  borderBackgroundColor?: string;
  isDisabled?: boolean;
}

export const Button: FunctionComponent<Props> = props => {
  const {
    text,
    onClick,
    type = 'button',
    styleType = 'background',
    primaryColor = 'heliotrope',
    secondaryColor = 'cyan',
    borderBackgroundColor = 'ebony',
    isDisabled = false
  } = props;

  return (
    <Wrapper
      type={type}
      styleType={styleType}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      borderBackgroundColor={borderBackgroundColor}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </Wrapper>
  );
};
