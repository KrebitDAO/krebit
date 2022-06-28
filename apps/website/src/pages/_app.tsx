import { ThemeProvider } from '@emotion/react';

import { theme } from 'theme';
import { globalStyles } from 'global-styles';
import { NavBar } from 'components';

const App = props => {
  const { Component, pageProps } = props;

  return (
    <>
      {globalStyles}
      <ThemeProvider theme={theme}>
        <NavBar />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default App;
