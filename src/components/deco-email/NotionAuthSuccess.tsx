import React, { useEffect } from 'react'
import { Flex, Heading } from '@chakra-ui/react'

export const NotionAuthSuccess = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close()
    }, 4000)
  }, [])

  return (
    <Flex>
      <Heading size="md">Successfully connected to Notion!</Heading>
    </Flex>
  )
}
