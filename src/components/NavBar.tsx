import React from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';
import Userfront from '@userfront/core';
import AppAuthentication from './AppAuthentication';

interface NavBarProps {
   userData: User;
}

function NavBar({ userData }: NavBarProps) {
   let navigate = useNavigate();

   if (Userfront.accessToken()) {
      return (
         <Flex flexDirection='column' alignContent='center' justifyContent='center'>
            <Flex alignItems='flex-start' justifyContent='space-between' height='120px' width='100%'>
               <Heading color='black' pl='10px'>
                  Your Hellodeco Account
               </Heading>

               <Flex mt='12px'>
                  <Button variant='link' ml='24px' onClick={() => navigate('/')}>
                     Home
                  </Button>
                  <Button variant='link' ml='24px' onClick={() => navigate('/account')}>
                     Account
                  </Button>
                  <Button variant='link' ml='24px' onClick={() => navigate('/reset-password')}>
                     Reset password
                  </Button>
                  <Button variant='link' ml='24px' onClick={() => Userfront.logout()}>
                     Logout
                  </Button>
               </Flex>
            </Flex>
         </Flex>
      );
   }

   return <AppAuthentication />;
}

export default NavBar;
