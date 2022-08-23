import { Wrapper } from './styles';

interface IProps {
  message: string;
}

export const ToolTip = (props: IProps) => {
  const { message } = props;

  return <Wrapper>{message}</Wrapper>;
};
