import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContent.jsx';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CartProvider><App /></CartProvider>
    
  </Provider>,
)
