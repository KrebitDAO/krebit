import { StyledEngineProvider } from '@mui/material';
import MaterialSlider from '@mui/material/Slider';

import { Wrapper } from './styles';

interface IProps {
  ariaLabel: string;
  value: number | number[];
  onChange: (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  min?: number;
  max?: number;
}

export const Slider = (props: IProps) => {
  const { ariaLabel, value, onChange, min = 10, max = 1000 } = props;

  return (
    <StyledEngineProvider injectFirst>
      <Wrapper>
        <MaterialSlider
          getAriaLabel={() => ariaLabel}
          value={value}
          onChange={onChange}
          valueLabelDisplay="auto"
          min={min}
          max={max}
        />
      </Wrapper>
    </StyledEngineProvider>
  );
};
