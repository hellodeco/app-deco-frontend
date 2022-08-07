import React from 'react'
import Userfront from '@userfront/core'
import { Helmet } from 'react-helmet'
import { ChakraProvider, extendTheme, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import PasswordResetPage from './auth-components/PasswordResetPage'
import AuthedRoute, { AuthedRouteProps } from './auth-components/AuthedRoute'
import AppAccount from './components/AppAccount'
import './App.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import LoginPage from './auth-components/LoginPage'
import SignupPage from './auth-components/SignupPage'
import PostCheckout from './components/PostCheckout'
import DecoEmail from './components/DecoEmail'
import HomePage from './components/HomePage'
import ResetPasswordPage from './auth-components/ResetPasswordPage'
import { GET_USER_META } from './graphql/queries'
import { NotionAuthFail } from './components/deco-email/NotionAuthFail'
import { Attachments } from './components/Attachments'
import { NotionAuthSuccess } from './components/deco-email/NotionAuthSuccess'
import NavBarLayout from './components/NavBarLayout'

const MAIN_YELLOW = '#F7CD45'

const theme = extendTheme({
  colors: {
    purple: {
      light: '#C8B1FA',
      dark: '#5A78FF',
    },
    gray: {
      light: '#FAFAFA',
      dark: '#404040',
    },
    gradient: {
      pink: 'linear-gradient(180deg, rgba(255, 67, 206, 0.2) 0%, rgba(207, 161, 195, 0.165434) 51.04%, rgba(255, 210, 251, 0.0104167) 99.96%, rgba(201, 0, 181, 0) 99.97%)',
    },
  },
  fonts: {
    body: '"HK-Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol""',
    heading:
      '"HK-Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol""',
    mono: '"SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace"',
  },
})

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_API_URL}/api`,
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
})

function App() {
  const { loading, data } = useQuery(GET_USER_META)
  // const { authError } = usePasswordlessLogin()

  // if (authError) {
  //   console.error(authError)
  // }

  const userData = data?.currentUser

  // retaining for future mobile options
  const isMobileDevice = useMediaQuery({
    query: '(max-device-width: 450px)',
  })

  const defaultAuthedRouteProps: Omit<AuthedRouteProps, 'outlet'> = {
    isAuthenticated: Userfront.accessToken(),
    authenticationPath: '/',
  }

  if (loading) {
    return null
  }

  // Shout out to the below stack overflow for the great protected route component guide
  // https://stackoverflow.com/questions/47747754/how-to-rewrite-the-protected-private-route-using-typescript-and-react-router-4
  return (
    <ChakraProvider theme={theme}>
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
            <NavBarLayout>
              <AuthedRoute
                {...defaultAuthedRouteProps}
                outlet={<AppAccount userData={userData} />}
              />
            </NavBarLayout>
          }
        />

        <Route
          path="/email"
          element={
            <NavBarLayout>
              <AuthedRoute
                {...defaultAuthedRouteProps}
                outlet={<DecoEmail userData={userData} />}
              />
            </NavBarLayout>
          }
        />

        <Route
          path="/reset-password"
          element={
            <NavBarLayout>
              <PasswordResetPage />
            </NavBarLayout>
          }
        />

        <Route
          path="/login"
          element={
            <NavBarLayout>
              <LoginPage />
            </NavBarLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <NavBarLayout>
              <SignupPage />
            </NavBarLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <NavBarLayout>
              <ResetPasswordPage />
            </NavBarLayout>
          }
        />
        <Route
          path="/post-checkout"
          element={
            <NavBarLayout>
              <PostCheckout />
            </NavBarLayout>
          }
        />
        <Route
          path="/oauth/notion/fail"
          element={
            <NavBarLayout>
              <NotionAuthFail />
            </NavBarLayout>
          }
        />
        <Route
          path="/oauth/notion/success"
          element={
            <NavBarLayout>
              <NotionAuthSuccess />
            </NavBarLayout>
          }
        />

        <Route
          path="/files/attachments/:attachmentId/:filename/preview"
          element={<Attachments />}
        />

        <Route
          path="/"
          element={
            <NavBarLayout>
              <HomePage />
            </NavBarLayout>
          }
        />
      </Routes>
    </ChakraProvider>
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
