import React from 'react';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Head from 'next/head';
import db from '../db.json';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    /* New styles */
    display: flex;
    flex-direction: column;
    font-family: 'Lato', sans-serif;
    // Deixa branco no começo
    color: ${({ theme }) => theme.colors.contrastText};
  }
  html, body {
    min-height: 100vh;
  }
  #__next {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

const { theme } = db;

// eslint-disable-next-line react/prop-types
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet" />

        <meta property="og:locale" content="pt_BR" key="ogLocale" />

        <meta property="og:url" content="https://pokequiz.adrianotobias.vercel.app/" key="ogUrl" />

        <meta property="og:title" content="PokéQuiz #AluraQuiz" key="ogTitle" />
        <meta property="og:site_name" content="PokéQuiz" key="ogSite_name" />

        <meta property="og:description" content="Desenvolvimento durante a imersão React Next.js da Alura" key="ogDescription" />

        <meta property="og:image" content="https://ultimatodobacon.com/wp-content/uploads/2019/02/Pokemon-Movie-20-I-Choose-You-Misty-Brock-620x330.jpg" key="ogImage" />
        <meta property="og:image:type" content="image/jpg" key="ogImageType" />
        <meta property="og:image:width" content="620" key="ogImageWidth" />
        <meta property="og:image:height" content="330" key="ogImageheight" />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
