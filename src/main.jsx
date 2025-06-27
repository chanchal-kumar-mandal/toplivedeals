// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/shared/ScrollToTop';
import App from './App.jsx';

// Core Vite CSS (cleaned up as per previous instructions)
import './index.css';

// Bootstrap CSS and JS (first to ensure its resets apply)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Your application-specific CSS (should generally be last to override others)
import './App.css';

// 🟢 GA4 Initialization
import ReactGA from 'react-ga4';
ReactGA.initialize('G-XXXXXXXXXX');  // ← Replace with your GA4 Measurement ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap your App component (or your top-level component that uses routing) */}
    <BrowserRouter basename="/toplivedeals">
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);