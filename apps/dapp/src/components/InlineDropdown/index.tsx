import { Wrapper } from './styles';

interface IProps {
  items: {
    title: string;
    onClick: () => void;
  }[];
}

export const InlineDropdown = (props: IProps) => {
  const { items } = props;

  return (
    <Wrapper>
      {items.map((item, index) => (
        <button
          className="inline-dropdown-item"
          key={index}
          onClick={item.onClick}
        >
          {item.title}
        </button>
      ))}
    </Wrapper>
  );
};
