import React from 'react';
import Userfront from '@userfront/core';
import { Helmet } from 'react-helmet';
import { ChakraProvider, extendTheme, Box, Text } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import PasswordResetPage from './auth-components/PasswordResetPage';
import AuthedRoute, { AuthedRouteProps } from './auth-components/AuthedRoute';
import AppAccount from './components/AppAccount';
import './App.css';
import {
   ApolloClient,
   InMemoryCache,
   NormalizedCacheObject,
   ApolloProvider,
   HttpLink,
   useQuery,
   gql,
} from '@apollo/client';
import NavBar from './components/NavBar';
import LoginPage from './auth-components/LoginPage';
import SignupPage from './auth-components/SignupPage';
import PostCheckout from './components/PostCheckout';
import DecoEmail from './components/DecoEmail';

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
});

const GET_USER_META = gql`
   query currentUser {
      currentUser {
         fullName
         userfrontID
         emailAddress
         signupEmail
      }
   }
`;

function App() {
   const { loading, error, data } = useQuery(GET_USER_META);

   const newUserData = data?.currentUser;

   // retaining for future mobile options
   const isMobileDevice = useMediaQuery({
      query: '(max-device-width: 450px)',
   });

   const defaultAuthedRouteProps: Omit<AuthedRouteProps, 'outlet'> = {
      isAuthenticated: Userfront.accessToken(),
      authenticationPath: '/',
   };

   // Shout out to the below stack overflow for the great protected route component guide
   // https://stackoverflow.com/questions/47747754/how-to-rewrite-the-protected-private-route-using-typescript-and-react-router-4
   return (
      <ChakraProvider theme={theme}>
         <Helmet>
            <meta property='og:url' content='https://apps.hellodeco.co' />
         </Helmet>
         <Box maxW='920px' maxH='700px' mx='auto' mt='60px'>
            <NavBar />
            <Routes>
               {/* redirect to this URL on successful login is set within Userfront dashboard */}
               <Route
                  path='/account'
                  element={<AuthedRoute {...defaultAuthedRouteProps} outlet={<AppAccount userData={newUserData} />} />}
               />

               <Route
                  path='/email'
                  element={<AuthedRoute {...defaultAuthedRouteProps} outlet={<DecoEmail userData={newUserData} />} />}
               />

               <Route path='/reset-password' element={<PasswordResetPage />} />

               <Route path='/login' element={<LoginPage />} />

               <Route path='/signup' element={<SignupPage />} />

               <Route path='/post-checkout' element={<PostCheckout />} />

               {/* <Route path='/' element={<AppAuthentication userData={userData} />} /> */}
            </Routes>
         </Box>
      </ChakraProvider>
   );
}

const WrappedApp = () => {
   const accessTokenData = Userfront.tokens;

   const link = new HttpLink({
      uri: `${process.env.REACT_APP_API_URL}/api`,
      headers: { Authorization: `Bearer ${accessTokenData?.accessToken}` },
   });

   const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
      link: link,
      cache: new InMemoryCache(),
   });

   return (
      <Router>
         <ApolloProvider client={client}>
            <App />
         </ApolloProvider>
      </Router>
   );
};

export default WrappedApp;
