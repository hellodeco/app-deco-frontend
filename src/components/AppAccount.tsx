import {
  Flex,
  Heading,
  Divider,
  Button,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
} from '@chakra-ui/react'
import Userfront from '@userfront/core'
import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import type { User } from '../types/types'
import { GET_USER_META } from '../graphql/queries'

function AppAccount() {
  const { loading, data } = useQuery<{ currentUser: User }>(GET_USER_META)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [validateNewPassword, setValidateNewPassword] = useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  const userData = data?.currentUser

  if (loading) {
    return (
      <Flex>
        Loading...
      </Flex>
    )
  }

  const handleStripeBillingPortal = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    let stripeURL
    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userfrontUserId: userData?.userfrontID,
        email: userData?.signupEmail,
      }),
    }

    if (paywallEnabled) {
      stripeURL = '/stripe/checkout-session'
    } else {
      stripeURL = '/stripe/billing-portal'
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}${stripeURL}`,
      payload,
    )

    if (response.status !== 200) {
      console.log('Error opening Stripe billing portal')
      return
    }

    const resBody = await response.json()
    window.location = resBody.sessionUrl
  }

  const handlePasswordReset = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (newPassword !== validateNewPassword) {
      setErrorMessage("Passwords don't match")
      return
    }

    try {
      await Userfront.user.updatePassword({
        password: newPassword,
        existingPassword: oldPassword,
        method: 'jwt',
      })

      setOldPassword('')
      setNewPassword('')
      setValidateNewPassword('')
      setSuccessMessage('Password has been reset')
    } catch (err) {
      // handle err
      console.log(typeof err, err)
      setErrorMessage('Please ensure your old password is correct')
    }
  }

  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  return (
    <Flex flexDirection="column" w="100%" mx="20px" mb="40px">
      <Heading size="xl">Account Details</Heading>
      {paywallEnabled && (
        <Alert status="error" mt="30px">
          <AlertTitle>Looks like you don't have a subscription!</AlertTitle>
          <AlertDescription>
            Purchase subscription to get started.
          </AlertDescription>
        </Alert>
      )}
      <Divider my="30px" />
      <Heading size="md" mb="20px">
        Signup Information
      </Heading>
      Your signup email: {userData?.signupEmail}
      <Divider my="30px" />
      <Heading size="md" mb="20px">
        Manage Billing
      </Heading>
      <Button
        color={'white'}
        backgroundColor={'blue.light'}
        border={'1px solid blue.dark'}
        _hover={{ backgroundColor: 'blue.dark' }}
        width="300px"
        onClick={handleStripeBillingPortal}
      >
        {paywallEnabled ? 'Purchase subscription' : 'Go to billing'}
      </Button>
      <Divider my="30px" />
      <Heading size="md" mb="20px">
        Reset Password
      </Heading>
      <Stack spacing={4} pb="6">
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
      <FormControl>
        <FormLabel htmlFor="password">Old password</FormLabel>
        <Flex flexDir="row" alignItems="center">
          <Input
            w="300px"
            size="lg"
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old password"
            mb="20px"
          />
        </Flex>

        <FormLabel htmlFor="password">New password</FormLabel>
        <Flex flexDir="row" alignItems="center">
          <Input
            w="300px"
            size="lg"
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            mb="20px"
          />
        </Flex>

        <FormLabel htmlFor="password">Verify new password</FormLabel>
        <Flex flexDir="row" alignItems="center">
          <Input
            w="300px"
            size="lg"
            id="validateNewPassword"
            type="password"
            value={validateNewPassword}
            onChange={(e) => setValidateNewPassword(e.target.value)}
            placeholder="Verify new password"
            mb="20px"
          />
        </Flex>
      </FormControl>
      <Button
        color={'white'}
        backgroundColor={'blue.light'}
        border={'1px solid blue.dark'}
        _hover={{ backgroundColor: 'blue.dark' }}
        width="300px"
        my="20px"
        onClick={handlePasswordReset}
      >
        Reset password
      </Button>
    </Flex>
  )
}

export default AppAccount
