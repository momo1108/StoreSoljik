import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainRouter from './router/MainRouter.tsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  </React.StrictMode>,
);
