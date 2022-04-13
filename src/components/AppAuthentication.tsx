import React from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function AppAuthentication() {
   let navigate = useNavigate();

   return (
      <Flex flexDirection='column' alignContent='center' justifyContent='center'>
         <Flex alignItems='flex-start' justifyContent='space-between' height='120px' width='100%'>
            <Heading color='black' pl='10px'>
               Welcome to Hellodeco
            </Heading>

            <Flex mt='12px'>
               <Button variant='link' ml='24px' onClick={() => navigate('/')}>
                  Home
               </Button>
               <Button variant='link' ml='24px' onClick={() => navigate('/login')}>
                  Login
               </Button>
               <Button variant='link' ml='24px' onClick={() => navigate('/signup')}>
                  Signup
               </Button>
               <Button variant='link' ml='24px' onClick={() => navigate('/reset-password')}>
                  Reset password
               </Button>
            </Flex>
         </Flex>
      </Flex>
   );
}

export default AppAuthentication;
