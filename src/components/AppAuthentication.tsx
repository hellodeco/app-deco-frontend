import React, { useState } from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';

import type { User } from '../types/types';
import Userfront from '@userfront/core';
import LoginPage from '../auth-components/LoginPage';
import SignupPage from '../auth-components/SignupPage';
import ResetPasswordPage from '../auth-components/ResetPasswordPage';

interface AppDashboardProps {
   userData: User;
}

function AppAuthentication({ userData }: AppDashboardProps) {
   const [loginType, setLoginType] = useState('');

   const loginTypes = {
      login: 'login',
      signup: 'signup',
      resetPassword: 'resetPassword',
   };

   const renderAuthComponents = (componentType: string) => {
      if (Userfront.accessToken()) {
         return;
      }

      switch (componentType) {
         case loginTypes.login: {
            return <LoginPage />;
         }
         case loginTypes.signup: {
            return <SignupPage />;
         }
         case loginTypes.resetPassword: {
            return <ResetPasswordPage />;
         }
      }
   };

   return (
      <Flex flexDirection='column' alignContent='center' justifyContent='center'>
         <Flex alignItems='flex-start' justifyContent='space-between' height='120px' width='100%'>
            <Heading color='black' pl='10px'>
               Welcome to Hellodeco
            </Heading>

            <Flex mt='12px'>
               <Button variant='link' ml='24px' onClick={() => setLoginType(loginTypes.login)}>
                  Login
               </Button>
               <Button variant='link' ml='24px' onClick={() => setLoginType(loginTypes.signup)}>
                  Signup
               </Button>
               <Button variant='link' ml='24px' onClick={() => setLoginType(loginTypes.resetPassword)}>
                  Reset password
               </Button>
            </Flex>
         </Flex>

         {renderAuthComponents(loginType)}
      </Flex>
   );
}

export default AppAuthentication;
