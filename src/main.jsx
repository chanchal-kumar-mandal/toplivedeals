// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Core Vite CSS (cleaned up as per previous instructions)
import './index.css';

// Bootstrap CSS and JS (first to ensure its resets apply)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Custom Swiper CSS
import './swiper-custom.css';

// Your application-specific CSS (should generally be last to override others)
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap your App component (or your top-level component that uses routing) */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);