import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Modal from 'react-modal';
import store from './store';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getTheme from './theme';

Modal.setAppElement('#root');

const ThemeWrapper = ({ children }) => {
  const themeMode = useSelector((state) => state?.theme || 'light');
  const theme = getTheme(themeMode);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeWrapper>
          <CssBaseline />
          <ToastContainer />
          <App />
        </ThemeWrapper>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

