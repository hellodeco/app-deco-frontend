import React from 'react'
import Userfront from '@userfront/core'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PasswordResetPage from './auth-components/PasswordResetPage'
import AuthedRoute from './auth-components/AuthedRoute'
import AppAccount from './components/AppAccount'
import Help from './components/HelpAccount'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Navigate } from 'react-router-dom'
import LoginPage from './auth-components/LoginPage'
import SignupPage from './auth-components/SignupPage'
import PostCheckout from './components/PostCheckout'
import DecoEmail from './components/DecoEmail'
import ForgotPasswordPage from './auth-components/ForgotPasswordPage'
import { NotionAuthFail } from './components/deco-email/NotionAuthFail'
import { Attachments } from './components/Attachments'
import { NotionAuthSuccess } from './components/deco-email/NotionAuthSuccess'
import SideNavigationLayout from './components/layouts/SideNavigationLayout'
import { ReplyCreateLoader } from './components/email-reply/ReplyCreateLoader'
import { ReplySendLoader } from './components/email-reply/ReplySendLoader'
const MAIN_YELLOW = '#F7CD45'

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_GRAPHQL_URL}`,
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessTokenData = Userfront.tokens
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${accessTokenData?.accessToken}`,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  name: 'web',
  version: '1.0',
})

function App() {
  const wildCardNavigateTo = Userfront.accessToken() ? '/email' : '/login'

  // Shout out to the below stack overflow for the great protected route component guide
  // https://stackoverflow.com/questions/47747754/how-to-rewrite-the-protected-private-route-using-typescript-and-react-router-4
  return (
    <div>
      <Helmet>
        <meta property="og:url" content="https://app.hellodeco.so" />
        <meta property="og:title" content="Email for your Notion workspace" />
        <meta
          property="og:description"
          content="Route email directly to a Notion database—no coding required!"
        />
        <meta property="og:image" content="./hellodeco.png?v=1" />
        <meta property="og:site_name" content="Hellodeco" />
        <meta name="twitter:site" content="@hellodecoapp" />
        <link rel="icon" href="./favicon.ico" />
        <meta name="theme-color" content={MAIN_YELLOW} />
      </Helmet>
      <Routes>
        {/* redirect to this URL on successful login is set within Userfront dashboard */}
        <Route
          path="/account"
          element={
            <AuthedRoute>
              <SideNavigationLayout>
                <AppAccount />
              </SideNavigationLayout>
            </AuthedRoute>
          }
        />

        <Route
          path="/email"
          element={
            <AuthedRoute>
              <SideNavigationLayout>
                <DecoEmail />
              </SideNavigationLayout>
            </AuthedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <AuthedRoute>
              <SideNavigationLayout>
                <Help />
              </SideNavigationLayout>
            </AuthedRoute>
          }
        />

        <Route path="/reset-password" element={<PasswordResetPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/post-checkout" element={<PostCheckout />} />

        <Route path="/oauth/notion/fail" element={<NotionAuthFail />} />

        <Route path="/oauth/notion/success" element={<NotionAuthSuccess />} />

        <Route
          path="/files/attachments/:attachmentId/:filename/preview"
          element={<Attachments />}
        />

        <Route
          path="/email/reply/create-notion-page/:originalEmailUUID"
          element={<ReplyCreateLoader />}
        />

        <Route
          path="/email/reply/send/:originalEmailUUID/:notionPageID"
          element={<ReplySendLoader />}
        />

        <Route path="*" element={<Navigate to={wildCardNavigateTo} />} />
      </Routes>
    </div>
  )
}

const WrappedApp = () => {
  return (
    <Router>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Router>
  )
}

export default WrappedApp
