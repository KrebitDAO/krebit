import { ChangeEvent } from 'react';

import { InputWrapper } from './styles';

import { StyledEngineProvider } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface IProps {
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?:
    | 'text'
    | 'search'
    | 'none'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal';
  pattern?: string;
  isMultiline?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  endAdornment?: string;
}

export const Input = (props: IProps) => {
  const {
    name,
    placeholder,
    value,
    onChange,
    type = 'text',
    pattern,
    isMultiline = false,
    isDisabled = false,
    isRequired = false,
    endAdornment
  } = props;

  return (
    <StyledEngineProvider injectFirst>
      <InputWrapper>
        <TextField
          name={name}
          label={placeholder}
          value={value || ''}
          type={type}
          onChange={onChange}
          variant="outlined"
          multiline={isMultiline}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          disabled={isDisabled}
          required={isRequired}
          rows={isMultiline ? 4 : 0}
          inputProps={{
            pattern
          }}
          InputProps={{
            inputMode: type,
            endAdornment: endAdornment ? (
              <InputAdornment position="end">{endAdornment}</InputAdornment>
            ) : undefined
          }}
        />
      </InputWrapper>
    </StyledEngineProvider>
  );
};
