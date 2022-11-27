import { ChangeEvent } from 'react';

import { Wrapper } from './styles';

import { StyledEngineProvider } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import MaterialSwitch from '@mui/material/Switch';

interface IProps {
  name: string;
  label: string;
  value: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
}

export const Switch = (props: IProps) => {
  const {
    name,
    label,
    value,
    onChange,
    isDisabled = false,
    isRequired = false
  } = props;

  return (
    <StyledEngineProvider injectFirst>
      <Wrapper>
        <FormControlLabel
          control={
            <MaterialSwitch
              checked={value || false}
              onChange={isDisabled ? undefined : onChange}
              name={name}
              disabled={isDisabled}
              required={isRequired}
            />
          }
          disabled={isDisabled}
          label={label}
        />
      </Wrapper>
    </StyledEngineProvider>
  );
};
