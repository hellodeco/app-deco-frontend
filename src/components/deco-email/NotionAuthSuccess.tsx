import React, { useEffect } from 'react'
import { Flex, Heading, Text } from '@chakra-ui/react'

export const NotionAuthSuccess = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close()
    }, 4000)
  }, [])

  return (
    <Flex direction={'column'}>
      <Heading size="md">Successfully connected to Notion!</Heading>
      <Text pt="15px">
        You can go ahead and close this tab, or wait for it to auto-close.
      </Text>
    </Flex>
  )
}
