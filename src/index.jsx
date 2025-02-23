import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * The root element where the React application will be rendered.
 * @type {HTMLElement}
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
/**
 * Creates a React root and renders the application inside the BrowserRouter
 * to enable client-side routing.
 */
root.render(
  <BrowserRouter>
  <App />
</BrowserRouter>
);

/**
 * Reports web vitals for performance measurement.
 * You can log the results (e.g., console.log) or send them to an analytics endpoint.
 * @see {@link https://bit.ly/CRA-vitals}
 */
reportWebVitals();
