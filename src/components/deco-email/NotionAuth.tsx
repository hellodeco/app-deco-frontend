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
import { useQuery } from '@apollo/client';
import { GET_NOTION_AUTH } from '../../graphql/queries';

interface IProps {}

const accessTokenData = Userfront.tokens;
const accessToken = accessTokenData?.accessToken;

const handleAuthWithNotion = () => {
   window.location.href = `${process.env.REACT_APP_API_URL}/oauth/notion?authToken=${accessToken}`;
};

export const NotionAuth = (props: IProps) => {
   const { loading, error, data } = useQuery(GET_NOTION_AUTH);
   const notionData = data?.getNotionIntegrationByUserfrontID;

   if (notionData) {
      return (
         <>
            <Heading size='md'>Connected to Workspace:</Heading>

            <Tag mt='15px' width='-webkit-fit-content' size='lg' variant='solid' colorScheme='green'>
               {notionData.workspaceName}
            </Tag>
         </>
      );
   }

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
