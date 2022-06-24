import { FunctionComponent, MouseEventHandler } from 'react';

import { Wrapper } from './styles';

interface Props {
  text: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const Button: FunctionComponent<Props> = props => {
  const { text, primaryColor, secondaryColor, backgroundColor, onClick } =
    props;

  return (
    <Wrapper
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      onClick={onClick}
      data={text}
    />
  );
};
