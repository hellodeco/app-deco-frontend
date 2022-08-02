import React from 'react'
import {
  Heading,
  Button,
  Text,
  Flex,
  Stack,
  InputGroup,
  Input,
  Alert,
  AlertTitle,
  AlertIcon,
} from '@chakra-ui/react'
import { useMutation } from '@apollo/client'
import { CREATE_NEW_USER } from '../graphql/mutations'
import Userfront from '@userfront/core'

const SignupPage = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordVerify, setPasswordVerify] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  const [handleCreateUser, { data: createUserData, loading, error }] =
    useMutation(CREATE_NEW_USER)

  console.log(createUserData)
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters')
    } else if (password !== passwordVerify) {
      setErrorMessage('Oops! Please make sure your passwords match')
    } else {
      setErrorMessage('')

      await handleCreateUser({
        variables: { email: email, password: password },
      })

      if (createUserData.createUserfrontAndDecoUser?.success) {
        Userfront.login({
          method: 'password',
          email: email,
          password: password,
        }).catch((error: any) => {
          setErrorMessage(error.message)
        })
      }
    }

    if (createUserData?.createUserfrontAndDecoUser?.errorMessage) {
      setErrorMessage(createUserData.createUserfrontAndDecoUser.errorMessage)
    }
  }

  return (
    <Flex maxWidth="md" flexDirection={'column'}>
      <Heading size={'md'}>Signup for Hellodeco</Heading>
      <Stack spacing={4} pb="6">
        <>
          <InputGroup>
            <Input
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Enter password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Verify your password"
              onChange={(event) => setPasswordVerify(event.target.value)}
            />
          </InputGroup>
        </>
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
        <Button
          mt="30px"
          colorScheme={'blue'}
          onClick={(event) => handleSignup(event)}
        >
          Signup
        </Button>
      </Stack>
    </Flex>
  )
}

export default SignupPage
