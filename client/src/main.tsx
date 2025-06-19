// client/src/main.tsx (НОВАЯ ВЕРСИЯ)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './App.css';
import { BrowserRouter } from 'react-router-dom'; // <-- ДОБАВИЛИ ЭТОТ ИМПОРТ

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- ОБЕРНУЛИ App В ЭТОТ КОМПОНЕНТ */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);