import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { ILoggedInSolidSession } from '../lib/solid-auth-fetcher/dist/solidSession/ISolidSession';
import { getSession } from '../lib/solid-auth-fetcher/dist';

// import Header from '../components/header';
import theme from '../src/theme';
import UserContextProvider, { UserContext } from '../src/contexts/UserContext';
import PodManagerHeader from '../components/header';


interface AppProps {
  Component: React.ComponentType;
  pageProps: any;
}

export default function App(props: AppProps) {
  const { setSession, setIsLoadingSession } = useContext(UserContext);
  const { Component, pageProps } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    async function fetchSession() {
      const sessionStorage = await getSession();

      if (sessionStorage && sessionStorage.webId) {
        setSession(sessionStorage);
        setIsLoadingSession(false);
      }
    }
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    fetchSession();
  }, [setSession, setIsLoadingSession]);

  return (
    <>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <UserContextProvider>
          <CssBaseline />
          {/* eslint react/jsx-props-no-spreading: 0 */}
          <PodManagerHeader />
          <Component {...pageProps} />
        </UserContextProvider>
      </ThemeProvider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  pageProps: PropTypes.object.isRequired,
};
