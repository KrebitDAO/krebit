import { StyledEngineProvider } from '@mui/material';
import TextField from '@mui/material/TextField';
import MaterialAutocomplete from '@mui/material/Autocomplete';

import { InputWrapper } from 'components/Input/styles';
import { theme } from 'theme';

interface IProps {
  id: string;
  options: string[];
  placeholder: string;
  value: string;
  inputValue: string;
  onChange: (event: any, newValue: string | null) => void;
  onInputChange: (event: any, newValue: string | null) => void;
  isLoading?: boolean;
}

export const Autocomplete = (props: IProps) => {
  const {
    id,
    options,
    placeholder,
    value,
    inputValue,
    onChange,
    onInputChange,
    isLoading = false
  } = props;

  return (
    <>
      <style global jsx>{`
        .MuiPaper-root,
        .MuiList-root > .MuiButtonBase-root {
          background-color: ${theme.colors.brightGray} !important;
          color: ${theme.colors.white};
        }

        .MuiButtonBase-root:hover {
          background-color: ${theme.colors.white}1A !important;
        }
      `}</style>
      <StyledEngineProvider injectFirst>
        <InputWrapper>
          <MaterialAutocomplete
            value={value || ''}
            onChange={onChange}
            inputValue={inputValue}
            onInputChange={onInputChange}
            id={id}
            loading={isLoading}
            options={options}
            renderInput={params => (
              <TextField {...params} label={placeholder} />
            )}
            isOptionEqualToValue={(option, value) => option === value}
            getOptionLabel={option => option}
          />
        </InputWrapper>
      </StyledEngineProvider>
    </>
  );
};
