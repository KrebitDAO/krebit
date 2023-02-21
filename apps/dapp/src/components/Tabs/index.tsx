import { SyntheticEvent } from 'react';

import { TabsWrapper } from './styles';

import { StyledEngineProvider } from '@mui/material';
import MaterialTabs from '@mui/material/Tabs';
import MaterialTab from '@mui/material/Tab';

interface IProps {
  value: number;
  onChange: (event: SyntheticEvent, newValue: number) => void;
  tabs: {
    text: string;
  }[];
  isDisabled?: boolean;
}

const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
};

export const Tabs = (props: IProps) => {
  const { value, onChange, tabs, isDisabled = false } = props;

  return (
    <StyledEngineProvider injectFirst>
      <TabsWrapper>
        <MaterialTabs
          value={value}
          onChange={isDisabled ? undefined : onChange}
          variant="fullWidth"
          disabled={isDisabled}
        >
          {tabs.map((tab, index) => (
            <MaterialTab key={index} label={tab.text} {...a11yProps(index)} />
          ))}
        </MaterialTabs>
      </TabsWrapper>
    </StyledEngineProvider>
  );
};
