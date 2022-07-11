import React from 'react'
import { Text, Flex, Heading } from '@chakra-ui/react'

const PostCheckout = () => {
  return (
    <Flex flexDirection="column" alignContent="center" justifyContent="center">
      <Heading color="black" size="md">
        Congratulations!
      </Heading>
      <br />
      <Text>
        {' '}
        Check your email - we're setting up your account now, and we've emailed
        you a magic link to get you logged in.
      </Text>{' '}
      <br />
      <Text>
        Once you're logged in, you can get started by choosing your @deco.so
        email address and connecting your Notion account.
      </Text>
    </Flex>
  )
}

export default PostCheckout
