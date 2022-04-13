import React, { useEffect, useState } from 'react';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';
import Userfront from '@userfront/core';

interface AppAccountProps {
   userData: User;
}

function AppAccount({ userData }: AppAccountProps) {
   let navigate = useNavigate();
   const [message, setMessage] = useState('');

   const handleLogout = () => {
      Userfront.logout();
   };

   const handleResetPassword = () => {
      navigate('/reset-password');
   };

   useEffect(() => {
      const backendResponse = async () => {
         const res: any = await fetch('http://localhost:4000/healthz');

         const message = await res.json();

         setMessage(res.message);
      };
      backendResponse();
   }, []);

   return (
      <Flex flexDirection='column' alignContent='center' justifyContent='center'>
         <Flex alignItems='flex-start' justifyContent='space-between' height='120px' width='100%'>
            <Heading color='black' pl='10px'>
               Your Hellodeco Account
            </Heading>

            <Flex mt='12px'>
               <Button px='24px' py='5px' variant='link' onClick={handleResetPassword}>
                  Reset password
               </Button>

               <Button px='24px' py='5px' variant='link' ml='20px' onClick={handleLogout}>
                  Logout
               </Button>
            </Flex>
         </Flex>

         <Flex direction='column' alignItems={'flex-start'}>
            <Heading px='13px' py='5px' size='sm'>
               {Userfront.user.email}
               {message}
            </Heading>
         </Flex>
      </Flex>
   );
}

export default AppAccount;
