import React from 'react'
import {
  Heading,
  Button,
  Stack,
  InputGroup,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
} from '@chakra-ui/react'
import Userfront from '@userfront/core'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  // Login with password state
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  let navigate = useNavigate()

  const handleLogin = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')

    Userfront.login({
      method: 'password',
      email: email,
      password: password,
    }).catch((error: any) => {
      setErrorMessage(error.message)
    })
  }

  return (
    <Flex maxWidth="md" flexDirection={'column'}>
      <Heading size={'md'} pb="6">
        Login to Hellodeco
      </Heading>
      <>
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
        </Stack>
        <Flex width="100%" justifyContent="flex-end">
          <Button onClick={(event) => handleLogin(event)}>Login</Button>
          <Button
            variant="link"
            ml="24px"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </Button>
        </Flex>
      </>
    </Flex>
  )
}

export default LoginPage
