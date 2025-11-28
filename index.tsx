
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initStorage } from './services/backend';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Initialize the database structure (Simulated SQL Tables)
initStorage();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
