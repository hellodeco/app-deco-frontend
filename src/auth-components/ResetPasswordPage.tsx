import React from 'react';
import { Heading, Button, Stack, InputGroup, Input, Alert, AlertIcon, AlertTitle, Flex } from '@chakra-ui/react';

import Userfront from '@userfront/core';

// todo - allow styling props

const ResetPasswordPage = () => {
   const [email, setEmail] = React.useState('');
   const [errorMessage, setErrorMessage] = React.useState('');
   const [successMessage, setSuccessMessage] = React.useState('');

   const handleResetPassword = (event: React.FormEvent) => {
      event.preventDefault();

      Userfront.sendResetLink(email).catch((error: any) => {
         setErrorMessage(error.message);
      });

      setSuccessMessage('Check your email for a link to reset your password');
   };

   return (
      <Flex maxWidth='md' flexDirection={'column'} ml='40px'>
         <Heading size={'md'} pb='6'>
            Reset password
         </Heading>

         <Stack spacing={4} pb='6'>
            <>
               <p>Enter the email associated with your account. We'll email you a link to reset your password!</p>
               <InputGroup>
                  <Input placeholder='Email' onChange={(event) => setEmail(event.target.value)} />
               </InputGroup>
            </>
            {errorMessage.length ? (
               <Alert status='error'>
                  <AlertIcon />
                  <AlertTitle mr={2}>{errorMessage}!</AlertTitle>
               </Alert>
            ) : (
               <></>
            )}
            {successMessage.length ? (
               <Alert status='success'>
                  <AlertTitle mr={2}>{successMessage}!</AlertTitle>
               </Alert>
            ) : (
               <></>
            )}
         </Stack>

         <Flex width='100%' justifyContent='flex-end'>
            <Button onClick={(event) => handleResetPassword(event)}>Reset Password</Button>
         </Flex>
      </Flex>
   );
};

export default ResetPasswordPage;
