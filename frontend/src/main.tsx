// Simple-peer (randombytes) expects Node-style globals.
// Set this BEFORE any imports to ensure it's available during module loading.
(window as any).global = window;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
