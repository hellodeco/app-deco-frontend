import React from 'react'
import {
  Heading,
  Button,
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

function getEmailParam() {
  let params = new URLSearchParams(window.location.search)
  return params.get('email') || ''
}

const SignupPage = () => {
  const [email, setEmail] = React.useState(getEmailParam())
  const [password, setPassword] = React.useState('')
  const [passwordVerify, setPasswordVerify] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  const [handleCreateUser, { data, loading, error }] = useMutation(
    CREATE_NEW_USER,
    {
      onCompleted: (data) => {
        const { success, errorMessage } = data.createUserfrontAndDecoUser

        if (success) {
          Userfront.login({
            method: 'password',
            email: email,
            password: password,
          }).catch((error: any) => {
            setErrorMessage(error.message)
          })
        }

        if (errorMessage) {
          setErrorMessage(data.createUserfrontAndDecoUser.errorMessage)
        }
      },
    },
  )

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
    }
  }

  return (
    <Flex maxWidth="md" flexDirection={'column'}>
      <Heading size={'md'} mb="20px">
        Signup
      </Heading>
      <Stack spacing={4} pb="6">
        <>
          <InputGroup>
            <Input
              placeholder="Email"
              value={email}
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
              placeholder="Verify password"
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
        <Button
          mt="30px"
          colorScheme={'blue'}
          onClick={(event) => handleSignup(event)}
          disabled={loading}
        >
          Signup
        </Button>
      </Stack>
    </Flex>
  )
}

export default SignupPage
