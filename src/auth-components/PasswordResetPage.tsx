import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Divider,
  Image,
  Stack,
  InputGroup,
  Input,
} from '@chakra-ui/react'
import Userfront from '@userfront/core'
import mailmanIllustration from '../media/hellodeco-logo.png'

function PasswordResetPage() {
  const [password, setPassword] = React.useState('')
  const [verifyPassword, setVerifyPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  const handlePasswordReset = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (password !== verifyPassword) {
      setErrorMessage("Passwords don't match")
      return
    }

    Userfront.resetPassword({
      password: password,
    })
      .then(() => {
        setSuccessMessage('Success! Logging you in')
      })
      .catch((err: any) => {
        setErrorMessage(
          'Uh-oh! We hit a snag. Try following the link from your email again',
        )
      })
  }

  return (
    <Flex>
      <Flex width={'400px'} mt="80px" flexDirection={'column'}>
        <Heading size={'md'} mb="6">
          Reset password
        </Heading>
        <Stack spacing={4}>
          <InputGroup>
            <Input
              type="password"
              placeholder="Enter new password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Verify new password"
              onChange={(event) => setVerifyPassword(event.target.value)}
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

          <Button
            color={'white'}
            backgroundColor={'blue.dark'}
            border={'1px solid blue.light'}
            _hover={{ backgroundColor: 'blue.light' }}
            onClick={handlePasswordReset}
          >
            Reset Password
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

export default PasswordResetPage
