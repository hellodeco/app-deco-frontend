import React, { useCallback } from 'react';
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

export const NotionAuth = (props: IProps) => {
   const { loading, error, data, refetch } = useQuery(GET_NOTION_AUTH);

   const handleAuthWithNotion = useCallback(() => {
      const params = new URLSearchParams()
      params.append('authToken', Userfront.tokens?.accessToken)
      const authUrl = `${process.env.REACT_APP_API_URL}/oauth/notion?${params.toString()}`
      const tab = window.open(authUrl, '_blank')
      tab?.focus()

      const interval = setInterval(() => {
         if (tab?.closed) {
            refetch()
            clearInterval(interval)
         }
      }, 300)
   }, [refetch])

   if (loading) {
      return (
         <span>loading...</span>
      )
   }

   const notionData = data?.getCurrentUserNotionIntegration;

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
