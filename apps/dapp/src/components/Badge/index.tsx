import { ReactNode } from 'react';

import { Wrapper } from './styles';

interface IProps {
  icon: ReactNode;
  text?: string;
  color?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const Badge = (props: IProps) => {
  const { icon, text, color = 'rose', iconColor = 'white', onClick } = props;

  return (
    <Wrapper onClick={onClick} color={color} iconColor={iconColor}>
      <p className="badge-text">{text}</p>
      {icon}
    </Wrapper>
  );
};
