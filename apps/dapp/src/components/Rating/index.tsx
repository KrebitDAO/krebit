import { useState, ChangeEvent } from 'react';

import { Wrapper } from './styles';

import { StyledEngineProvider } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import MaterialRating from '@mui/material/Rating';

interface IProps {
  name: string;
  label: string;
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  iconColor?: string;
}

export const Rating = (props: IProps) => {
  const {
    name,
    label,
    value,
    onChange,
    isDisabled = false,
    iconColor = 'cyan'
  } = props;
  const [hover, setHover] = useState(-1);

  return (
    <StyledEngineProvider injectFirst>
      <Wrapper iconColor={iconColor}>
        <FormControlLabel
          control={
            <MaterialRating
              value={value || 2.5}
              onChange={isDisabled ? undefined : onChange}
              name={name}
              disabled={isDisabled}
              precision={0.5}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
            />
          }
          disabled={isDisabled}
          label={hover !== -1 ? `Rating: ${hover * 2}/10` : label}
        />
      </Wrapper>
    </StyledEngineProvider>
  );
};
