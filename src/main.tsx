import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRouter from './router/MainRouter.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './style/GlobalStyle.tsx';
import theme from './style/theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
