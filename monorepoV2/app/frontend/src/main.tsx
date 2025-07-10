import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './presentation/routes/AppRouter';
import { LoadingProvider } from './application/context/LoadingContext';
import './styles.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <LoadingProvider>
      <AppRouter />
    </LoadingProvider>
  </React.StrictMode>
);
