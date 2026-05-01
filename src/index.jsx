import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './globalState/store.js'

document.title = `${import.meta.env.VITE_SHORT_BRAND_NAME} | ${import.meta.env.VITE_BRAND_TAGLINE}`;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)