import { FunctionComponent, MouseEventHandler, ReactNode } from 'react';

import { Wrapper } from './styles';

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  styleType?: 'background' | 'border' | 'border-rounded';
  primaryColor?: string;
  secondaryColor?: string;
  borderBackgroundColor?: string;
  isDisabled?: boolean;
}

export const Button: FunctionComponent<Props> = props => {
  const {
    onClick,
    text,
    icon,
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
      hasIcon={!!icon}
    >
      {icon ? icon : text}
    </Wrapper>
  );
};
