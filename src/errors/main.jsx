import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorsPage from './ErrorsPage.jsx';
import '../accessible/styles.css';
import './errors.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorsPage />
  </React.StrictMode>
);
