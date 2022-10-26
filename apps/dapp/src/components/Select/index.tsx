import { Wrapper, MenuItem } from './styles';
import { theme } from 'theme';

import { StyledEngineProvider } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MaterialSelect, { SelectChangeEvent } from '@mui/material/Select';

export interface IItems {
  text: string;
  value: string;
}

interface IProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  items: IItems[];
  isDisabled?: boolean;
  isRequired?: boolean;
}

export const Select = (props: IProps) => {
  const {
    id,
    name,
    label,
    value,
    onChange,
    items,
    isDisabled = false,
    isRequired = false
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
        <Wrapper>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id={`${id}-select-standard-label`}>{label}</InputLabel>
            <MaterialSelect
              labelId={`${id}-select-standard-label`}
              id={`${id}-select-standard`}
              name={name}
              value={value}
              onChange={onChange}
              label={label}
              disabled={isDisabled}
              required={isRequired}
            >
              {items.map((item, index) => (
                <MenuItem key={index} value={item.value}>
                  {item.text}
                </MenuItem>
              ))}
            </MaterialSelect>
          </FormControl>
        </Wrapper>
      </StyledEngineProvider>
    </>
  );
};
