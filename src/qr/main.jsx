import React from 'react';
import ReactDOM from 'react-dom/client';
import QrPage from './QrPage.jsx';
import '../accessible/styles.css';
import './qr.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QrPage />
  </React.StrictMode>
);
