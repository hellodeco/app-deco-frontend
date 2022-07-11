import React from 'react'
import { Heading, Button, Text, Flex } from '@chakra-ui/react'

const SignupPage = () => {
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/stripe/checkout-session`,
      { method: 'POST' },
    )
    const resBody = await response.json()
    window.location = resBody.sessionUrl
  }

  return (
    <Flex maxWidth="md" flexDirection={'column'}>
      <Heading size={'md'}>Signup for a Hellodeco email address</Heading>

      <Text mt="15px">
        Since email based services are commonly abused by spambots, we require
        new users to complete the checkout process in order to get signed up.
        The good news is that we offer everyone a 7 day free trial!
      </Text>

      <Text mt="15px">
        Click "Signup" below to navigate to our checkout page - once you're
        done, we'll send you an email to get logged into your account, and you
        can begin using Notion as your new inbox!
      </Text>
      <Button
        mt="30px"
        colorScheme={'blue'}
        onClick={(event) => handleSignup(event)}
      >
        Signup
      </Button>
    </Flex>
  )
}

export default SignupPage
