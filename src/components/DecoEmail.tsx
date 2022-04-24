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
   const [decoEmailIsAvailable, setDecoEmailIsAvailable] = useState('');

   const [handleUpdateEmail, updateEmailResult] = useMutation(UPDATE_USERS_DECO_EMAIL);

   const accessTokenData = Userfront.tokens;
   const accessToken = accessTokenData?.accessToken;

   return (
      <Flex flexDirection='column' w='100%'>
         <ManageDecoEmail userData={userData} />
         <NotionAuth />
         <FormatNotionPage />
      </Flex>
   );
}

export default DecoEmail;
