import React from 'react'
import ReactDOM from 'react-dom/client'

import GenreProvider from './components/api/genre-provider.js'
import App from './components/app/app.js'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <GenreProvider>
      <App />
    </GenreProvider>
  </React.StrictMode>
)
