import React from 'react';
import Userfront from '@userfront/core';
import { Helmet } from 'react-helmet';
import { ChakraProvider, extendTheme, Box, useTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import AppAuthentication from './components/AppAuthentication';
import { useUserData } from './hooks/useUserData';
import type { User } from './types/types';
import PasswordResetPage from './auth-components/PasswordResetPage';
import AuthedRoute, { AuthedRouteProps } from './auth-components/AuthedRoute';
import AppAccount from './components/AppAccount';
import './App.css';

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

interface ContainerProps {
   children: React.ReactNode;
   setUserData: (user: User) => void;
}

function DesktopContainer({ children }: ContainerProps) {
   const { space } = useTheme();

   return (
      <Box w='100vw' h='100vh' maxW='1500px' maxH='100vh' mx='auto' p={space['24']}>
         {children}
      </Box>
   );
}

function App() {
   const { userData, setUserData } = useUserData();

   // retaining for future mobile options
   const isMobileDevice = useMediaQuery({
      query: '(max-device-width: 450px)',
   });

   const Container = DesktopContainer;

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
         <Container setUserData={setUserData}>
            <Routes>
               {/* redirect to this URL on successful login is set within Userfront dashboard */}
               <Route
                  path='/account'
                  element={<AuthedRoute {...defaultAuthedRouteProps} outlet={<AppAccount userData={userData} />} />}
               />

               <Route path='/reset-password' element={<PasswordResetPage />} />

               <Route path='/' element={<AppAuthentication userData={userData} />} />
            </Routes>
         </Container>
      </ChakraProvider>
   );
}

const WrappedApp = () => (
   <Router>
      <App />
   </Router>
);

export default WrappedApp;
