import React from 'react'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { useQuery } from '../../hooks/useQuery'

export const NotionAuthFail = () => {
  const params = useQuery()

  return (
    <Flex flexDir="column">
      <Heading size="md" mb="15px">
        Uh-Oh! We were unable to connect your Notion workspace!
      </Heading>
      <Text>Here's the error message we got:</Text>
      <Text mt="15px" fontWeight="bold" color="red">
        Error: {params.get('message')}
      </Text>
      <Text mt="15px">Go ahead and close this tab and try again.</Text>
    </Flex>
  )
}
