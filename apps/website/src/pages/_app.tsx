import { ThemeProvider } from '@emotion/react';
import Head from 'next/head';

import { theme } from 'theme';
import { globalStyles } from 'global-styles';
import { NavBar } from 'components';

const App = props => {
  const { Component, pageProps } = props;

  return (
    <>
      {globalStyles}
      <Head>
        <title>Krebit</title>
        <link rel="icon" type="image/png" href="/imgs/logos/favicon.ico"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default App;
