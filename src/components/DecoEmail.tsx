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
   Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';
import Userfront from '@userfront/core';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EMAIL_AVAILABILITY } from '../graphql/queries';
import { UPDATE_USERS_DECO_EMAIL } from '../graphql/mutations';
import { ManageDecoEmail } from './deco-email/ManageDecoEmail';
import { NotionAuth } from './deco-email/NotionAuth';
import { FormatNotionPage } from './deco-email/FormatNotionPage';

interface DecoEmailProps {
   userData: User;
}

function DecoEmail({ userData }: DecoEmailProps) {
   const [decoEmail, setDecoEmail] = useState('');
   const [emailNotValid, setEmailNotValid] = useState(false);
   const [decoEmailIsAvailable, setDecoEmailIsAvailable] = useState('');

   const { loading, error, data } = useQuery(GET_EMAIL_AVAILABILITY, {
      variables: { decoEmail: decoEmail },
   });

   const [handleUpdateEmail, updateEmailResult] = useMutation(UPDATE_USERS_DECO_EMAIL);

   const emailAddressAvailable = data?.emailAddressAvailable;

   const accessTokenData = Userfront.tokens;
   const accessToken = accessTokenData?.accessToken;

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const decoEmail = e.target.value;
      setDecoEmail(decoEmail);

      if (verifyEmail(decoEmail)) {
         setEmailNotValid(false);
      } else {
         setEmailNotValid(true);
      }
   };

   const handleAuthWithNotion = () => {
      window.location.href = `${process.env.REACT_APP_API_URL}/oauth/notion?authToken=${accessToken}`;
   };

   // TODO - handle errors
   const handleUpdateDecoEmail = () => {
      handleUpdateEmail({
         variables: { decoEmail: decoEmail },
      });
   };

   const verifyEmail = (email: string) => {
      // TODO - update this regex to use the live domain @deco.so after we go live
      const emailRegex = /^\w+([\.-]?\w+)*@deco\.email$/;
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

         <FormControl mt='30px' isInvalid={emailNotValid || !emailAddressAvailable}>
            <FormLabel htmlFor='email'>Choose a new Deco email address ending in "@deco.email"</FormLabel>
            <Input
               w='450px'
               size='lg'
               id='email'
               type='email'
               value={decoEmail}
               onChange={handleChange}
               placeholder='name@deco.email'
            />
            {emailNotValid && <FormErrorMessage>Email address is invalid</FormErrorMessage>}
            {!emailAddressAvailable && <FormErrorMessage>Email address already taken</FormErrorMessage>}
         </FormControl>

         <Button w='300px' my='30px' onClick={handleUpdateDecoEmail} disabled={!emailAddressAvailable || emailNotValid}>
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
