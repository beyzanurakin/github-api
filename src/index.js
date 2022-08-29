import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { GithubProvider } from './context/context'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain='dev-4495qnxt.us.auth0.com'
      clientId='ykJn7ut1X0TZZ3Os2esyCb4eKXaVrPPN'
      redirectUri={window.location.origin}
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
    ,
  </React.StrictMode>,
  document.getElementById('root')
)
