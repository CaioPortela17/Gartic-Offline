import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/lara-dark-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import App from './App.jsx'
import './estilos.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>,
)
