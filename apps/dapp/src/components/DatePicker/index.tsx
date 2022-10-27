import { ChangeEvent } from 'react';
import { format } from 'date-fns';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { InputWrapper } from 'components/Input/styles';
import { useWindowSize } from 'hooks';
import { theme } from 'theme';

interface IProps {
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputFormat?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}

export const DatePicker = (props: IProps) => {
  const {
    name,
    placeholder,
    value,
    onChange,
    inputFormat = 'yyyy-MM-dd',
    isDisabled,
    isRequired
  } = props;
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;

  const handleChange = (value: number | Date) => {
    if (!value) return;

    const date = format(value, inputFormat);

    onChange({
      target: {
        name,
        value: date
      }
    } as any);
  };

  return (
    <>
      <style global jsx>{`
        .MuiPickersPopper-paper,
        .MuiDialog-paper {
          background-color: ${theme.colors.brightGray} !important;
          color: ${theme.colors.white};
        }

        .MuiButtonBase-root > .MuiSvgIcon-root {
          fill: ${theme.colors.white};
        }

        .MuiDayPicker-header > .MuiTypography-root,
        .MuiPickersToolbar-root > .MuiTypography-root {
          color: ${theme.colors.white};
        }

        .MuiDayPicker-weekContainer > .MuiButtonBase-root {
          background-color: ${theme.colors.bunting} !important;
          color: ${theme.colors.white};
        }

        .MuiDayPicker-weekContainer > .MuiButtonBase-root.Mui-selected {
          background-color: ${theme.colors.white} !important;
          color: ${theme.colors.bunting} !important;
        }

        .MuiDialogActions-root > .MuiButtonBase-root {
          color: ${theme.colors.white};
        }

        // Hide change button from calendar (not necessary)
        .MuiGrid-root > .MuiButtonBase-root {
          display: none;
        }
      `}</style>
      <InputWrapper>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {isDesktop ? (
            <DesktopDatePicker
              label={placeholder}
              value={value}
              onChange={handleChange}
              inputFormat={inputFormat}
              disabled={isDisabled}
              renderInput={params => (
                <TextField required={isRequired} {...params} />
              )}
            />
          ) : (
            <MobileDatePicker
              label={placeholder}
              value={value}
              onChange={handleChange}
              inputFormat={inputFormat}
              renderInput={params => (
                <TextField required={isRequired} {...params} />
              )}
            />
          )}
        </LocalizationProvider>
      </InputWrapper>
    </>
  );
};
