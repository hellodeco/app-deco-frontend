import React, { useEffect } from 'react'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { useQuery } from '../../hooks/useQuery'

export const NotionAuthFail = () => {
  const params = useQuery()

  // useEffect(() => {
  //   setTimeout(() => {
  //     window.close()
  //   }, 2000)
  // }, [])

  return (
    <Flex flexDir="column">
      <Heading size="md" mb="30px">
        Something unexpected happened and we were unable to connect you to your
        Notion :(
      </Heading>
      <Text color="red">{params.get('message')}</Text>
    </Flex>
  )
}
