import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import { Button, Stack, InputGroup, Input } from '@chakra-ui/react'
import Userfront from '@userfront/core'

function PasswordResetPage() {
  const [password, setPassword] = React.useState('')
  const [verifyPassword, setVerifyPassword] = React.useState('')

  const handlePasswordReset = (event: React.SyntheticEvent) => {
    event.preventDefault()

    // todo - add error handling
    if (password !== verifyPassword) {
      return
    }

    Userfront.resetPassword({
      password: password,
    })
  }

  return (
    <Flex maxWidth="md" flexDirection={'column'}>
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
      </Stack>

      <Button mr={3} mt={6} onClick={handlePasswordReset}>
        Reset Password
      </Button>
    </Flex>
  )
}

export default PasswordResetPage
