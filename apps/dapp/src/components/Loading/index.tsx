import { Wrapper } from './styles';

export const Loading = () => {
  return (
    <Wrapper>
      <div className="bx">
        <div className="spinner"></div>
        <div className="line">
          <svg height="100" width="100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#043CFC"
              strokeWidth="10"
              fill="none"
              strokeLinecap="square"
            />
          </svg>
        </div>
      </div>
    </Wrapper>
  );
};
