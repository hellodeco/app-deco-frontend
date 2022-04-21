import React, { useState } from 'react';
import {
   Flex,
   Heading,
   Divider,
   Button,
   Input,
   FormControl,
   FormLabel,
   FormErrorMessage,
   FormHelperText,
   Tag,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';
import Userfront from '@userfront/core';
import {
   ApolloClient,
   InMemoryCache,
   NormalizedCacheObject,
   ApolloProvider,
   HttpLink,
   useQuery,
   gql,
} from '@apollo/client';

interface DecoEmailProps {
   userData: User;
}

const GET_EMAIL_AVAILABILITY = gql`
   query isEmailAvailable($decoEmail: String) {
       emailAddressAvailable(email: $decoEmail)
   }
`;

function DecoEmail({ userData }: DecoEmailProps) {
   const [decoEmail, setDecoEmail] = useState('');
   const [decoEmailIsAvailable, setDecoEmailIsAvailable] = useState('');

   const { loading, error, data } = useQuery(GET_EMAIL_AVAILABILITY, {
      variables: { decoEmail: decoEmail },
   });

   const accessTokenData = Userfront.tokens;
   const accessToken = accessTokenData?.accessToken;

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const decoEmail = e.target.value;
      setDecoEmail(decoEmail);

      if (verifyEmail(decoEmail)) {
         console.log('email is valid');
      } else {
         console.log('email is NOT valid');
      }
   };

   const handleAuthWithNotion = () => {
      window.location.href = `${process.env.REACT_APP_API_URL}/oauth/notion?authToken=${accessToken}`;
   };

   const verifyEmail = (email: string) => {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
      return emailRegex.test(email);
   };

   return (
      <Flex flexDirection='column' w='100%'>
         <Heading size='xl'>Manage Your Deco Email</Heading>

         <Divider my='30px' />
         <Heading size='md'>Your Deco email address is:</Heading>
         <Tag mt='15px' width='-webkit-fit-content' size='lg' variant='solid' colorScheme='gray'>
            {userData?.emailAddress}
         </Tag>

         <FormControl mt='30px'>
            <FormLabel htmlFor='email'>Choose a new Deco email address</FormLabel>
            <Input
               w='450px'
               size='lg'
               id='email'
               type='email'
               value={decoEmail}
               onChange={handleChange}
               placeholder='name@deco.so'
            />
         </FormControl>

         <Button w='300px' my='30px' onClick={handleAuthWithNotion}>
            Save
         </Button>

         <Divider my='30px' />
         <Heading size='md'>Connect your Notion Account</Heading>
         <Button w='300px' my='30px' onClick={handleAuthWithNotion}>
            Connect to Notion
         </Button>
      </Flex>
   );
}

export default DecoEmail;
