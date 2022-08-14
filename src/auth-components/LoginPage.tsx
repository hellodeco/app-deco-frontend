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
import Userfront from '@userfront/core'
import { Navigate, useNavigate } from 'react-router-dom'
import mailmanIllustration from '../media/hellodeco-logo.png'

function getRedirectParam() {
  let params = new URLSearchParams(window.location.search)
  let redirectTo = params.get('redirect_to')

  if (!redirectTo) {
    return
  }

  return decodeURIComponent(redirectTo)
}

const LoginPage = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  let navigate = useNavigate()

  const handleLogin = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')

    Userfront.login({
      method: 'password',
      email: email,
      password: password,
      redirect: getRedirectParam(),
    }).catch((error: any) => {
      setErrorMessage(error.message)
    })
  }

  if (Userfront.accessToken()) {
    return <Navigate to={'/email'} />
  }

  return (
    <Flex>
      <Flex width={'400px'} mt="80px" flexDirection={'column'}>
        <Heading size={'md'} pb="6">
          Login
        </Heading>
        <Stack spacing={4} pb="6">
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
          <Flex width="100%" justifyContent="flex-start">
            <Button
              color="black"
              variant="link"
              pl="18px"
              onClick={() => navigate('/forgot-password')}
              fontSize="sm"
            >
              Forgot Password?
            </Button>
          </Flex>
          <Divider my="5px" />
          {errorMessage.length && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{errorMessage}!</AlertTitle>
            </Alert>
          )}
          <Button
            color={'white'}
            backgroundColor="blue.light"
            border={'1px solid blue.dark'}
            _hover={{ backgroundColor: 'blue.dark' }}
            onClick={(event) => handleLogin(event)}
          >
            Login
          </Button>
        </Stack>
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

export default LoginPage
