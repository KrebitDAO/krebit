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
        <title>Krebit - Portable Reputation for Better Job Matching</title>
        <meta
          name="description"
          content="Krebit connects the best Web3 talent trough portable Reputation. Professionals: build and claim your lifetime profile. Recruiters: Smooth access to pre-vetted talent, certified by trusted issuers"
        />
        <meta
          property="og:title"
          content="Krebit - Portable Reputation for Better Job Matching"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Krebit connects the best Web3 talent trough portable Reputation. Professionals: build and claim your lifetime profile. Recruiters: Smooth access to pre-vetted talent, certified by trusted issuers"
        />
        <meta
          property="og:image"
          content="https://krebit.id/imgs/images/reputation.jpg"
        />
        <meta property="og:url" content="https://krebit.id/" />
        <meta name="twitter:card" content="summary_large_image" />
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
