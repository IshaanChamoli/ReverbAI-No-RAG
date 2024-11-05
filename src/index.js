// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatApp from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>
);
