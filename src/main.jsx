import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Optional: Tailwind or your own CSS
import { BrowserRouter } from 'react-router-dom'; // Wrap app with router

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap everything in BrowserRouter so routing works */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
