import { FunctionComponent, MouseEventHandler } from 'react';

import { Wrapper } from './styles';

interface Props {
  text: string;
  primaryColor: string;
  secondaryColor: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  hasTransparency?: boolean;
}

export const Button: FunctionComponent<Props> = props => {
  const {
    text,
    primaryColor,
    secondaryColor,
    onClick,
    hasTransparency = true,
  } = props;

  return (
    <Wrapper
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      hasTransparency={hasTransparency}
      onClick={onClick}
    >
      {text}
    </Wrapper>
  );
};
