import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './app/store';
import theme from './theme/theme';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Redux: estado global disponible en toda la app */}
    <Provider store={store}>
      {/* React Router: sistema de navegación */}
      <BrowserRouter>
        {/* MUI Theme: estilos globales consistentes */}
        <ThemeProvider theme={theme}>
          {/* CssBaseline: reset CSS de MUI */}
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);