import 'regenerator-runtime/runtime';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import SiteContextProvider from './siteContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SiteContextProvider>
      <App />
    </SiteContextProvider>
  </React.StrictMode>,
)
