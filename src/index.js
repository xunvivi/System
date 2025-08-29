import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store'; 
import App from './App';
import reportWebVitals from './reportWebVitals';
import AppRouter from './router';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'; 
 import 'bootstrap/dist/css/bootstrap.min.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();