import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CatalogProvider } from './lib/catalog'
import { BagProvider } from './lib/bag'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <BagProvider>
          <App />
        </BagProvider>
      </CatalogProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
