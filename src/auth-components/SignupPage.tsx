import React from 'react';
import { Heading, Button, Stack, InputGroup, Input, Alert, AlertIcon, AlertTitle, Flex } from '@chakra-ui/react';

import Userfront from '@userfront/core';

// todo - allow styling props

const SignupPage = () => {
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [verifyPassword, setVerifyPassword] = React.useState('');
   const [errorMessage, setErrorMessage] = React.useState('');
   const [successMessage, setSuccessMessage] = React.useState('');

   const handleSignup = (event: React.FormEvent) => {
      event.preventDefault();

      if (password !== verifyPassword) {
         setErrorMessage("Passwords don't match");
         return;
      }

      Userfront.signup({
         method: 'password',
         email: email,
         password: password,
      }).catch((error: any) => {
         setErrorMessage(error.message);
      });
   };

   return (
      <Flex maxWidth='md' flexDirection={'column'} ml='40px'>
         <Heading size={'md'} pb='6'>
            Create a Hellodeco account
         </Heading>

         <Stack spacing={4} pb='6'>
            <InputGroup>
               <Input placeholder='Email' onChange={(event) => setEmail(event.target.value)} />
            </InputGroup>

            <InputGroup>
               <Input
                  type='password'
                  placeholder='Enter password'
                  onChange={(event) => setPassword(event.target.value)}
               />
            </InputGroup>

            <InputGroup>
               <Input
                  type='password'
                  placeholder='Verify password'
                  onChange={(event) => setVerifyPassword(event.target.value)}
               />
            </InputGroup>

            {errorMessage.length ? (
               <Alert status='error'>
                  <AlertIcon />
                  <AlertTitle mr={2}>{errorMessage}!</AlertTitle>
               </Alert>
            ) : null}

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
            <Button onClick={(event) => handleSignup(event)}>Signup</Button>
         </Flex>
      </Flex>
   );
};

export default SignupPage;
