import React from 'react';
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
import Userfront from '@userfront/core';

interface IProps {}

const accessTokenData = Userfront.tokens;
const accessToken = accessTokenData?.accessToken;

const handleAuthWithNotion = () => {
   window.location.href = `${process.env.REACT_APP_API_URL}/oauth/notion?authToken=${accessToken}`;
};

export const NotionAuth = (props: IProps) => {
   return (
      <>
         <Divider my='30px' />
         <Heading size='md'>Connect your Notion Account</Heading>
         <Button w='300px' my='30px' onClick={handleAuthWithNotion}>
            Connect to Notion
         </Button>
      </>
   );
};
