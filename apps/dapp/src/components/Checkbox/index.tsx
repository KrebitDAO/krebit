import { ChangeEvent } from 'react';

import { StyledEngineProvider } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import MaterialCheckbox from '@mui/material/Checkbox';

import { CheckboxWrapper } from './styles';

interface IProps {
  name: string;
  placeholder: string;
  value: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
}

export const Checkbox = (props: IProps) => {
  const {
    name,
    placeholder,
    value,
    onChange,
    isDisabled = false,
    isRequired = false
  } = props;

  return (
    <StyledEngineProvider injectFirst>
      <CheckboxWrapper>
        <FormControlLabel
          control={
            <MaterialCheckbox
              name={name}
              checked={value}
              onChange={onChange}
              required={isRequired}
            />
          }
          label={placeholder}
          disabled={isDisabled}
        />
      </CheckboxWrapper>
    </StyledEngineProvider>
  );
};
