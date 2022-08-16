import React from 'react'
import {
  Divider,
  Heading,
  Button,
  Stack,
  InputGroup,
  Input,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
} from '@chakra-ui/react'
import mailmanIllustration from '../media/hellodeco-logo.png'

import Userfront from '@userfront/core'

const ForgotPasswordPage = () => {
  const [email, setEmail] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  const handleResetPassword = (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setEmail('')
    if (!email) {
      setErrorMessage('Please enter a valid email')
      return
    }

    Userfront.sendResetLink(email)
      .then(({ result }: { result: { url: string } }) => {
        // this will exist when in test mode (e.g. local development)
        if (result?.url) {
          console.log(result.url)
        }
      })
      .catch((error: any) => {
        setErrorMessage(error.message)
      })

    setSuccessMessage('Check your email')
  }

  return (
    <Flex>
      <Flex width={'400px'} mt="80px" flexDirection={'column'}>
        <Heading size={'md'} pb="6">
          Reset password
        </Heading>

        <Stack spacing={4} pb="6">
          <p>
            Enter the email associated with your account. We'll email you a link
            to reset your password!
          </p>
          <InputGroup>
            <Input
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </InputGroup>
          <Divider my="5px" />
          {errorMessage.length && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{errorMessage}!</AlertTitle>
            </Alert>
          )}
          {successMessage.length && (
            <Alert status="success">
              <AlertTitle mr={2}>{successMessage}!</AlertTitle>
            </Alert>
          )}
        </Stack>

        <Button
          color={'white'}
          backgroundColor={'blue.dark'}
          border={'1px solid blue.light'}
          _hover={{ backgroundColor: 'blue.light' }}
          onClick={(event) => handleResetPassword(event)}
        >
          Email Reset Link
        </Button>
      </Flex>
      <Image
        ml="80px"
        maxWidth={'350px'}
        maxHeight={'350px'}
        src={mailmanIllustration}
        alt="A stylized illustration of a mailman delivers a letter to a mailbox"
      />
    </Flex>
  )
}

export default ForgotPasswordPage
