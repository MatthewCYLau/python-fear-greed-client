import React from 'react'
import ReactDOM from 'react-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './App.css'
import App from './App'

ReactDOM.render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
  document.getElementById('root')
)
