import { Flex, Heading, Divider, Button } from '@chakra-ui/react'
import React from 'react'
import type { User } from '../types/types'
import Userfront from '@userfront/core'

interface AppAccountProps {
  userData: User
}

function AppAccount({ userData }: AppAccountProps) {
  const handleStripeBillingPortal = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/stripe/billing-portal`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userfrontUserId: userData?.userfrontID }),
      },
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
    await Userfront.sendResetLink(userData?.signupEmail)
  }

  return (
    <Flex flexDirection="column">
      <Heading size="xl">Account Details</Heading>
      <Divider my="30px" />
      <Heading size="md">Signup Information</Heading>
      {userData?.fullName}
      <br />
      {userData?.signupEmail}
      <Divider my="30px" />
      <Heading size="md">Manage Billing</Heading>
      <Button onClick={handleStripeBillingPortal}>Open Billing Portal</Button>
      <Divider my="30px" />
      <Heading size="md">Manage Password</Heading>
      The reset password option will email you a link to reset your password.
      <Button mb="30px" onClick={handlePasswordReset}>
        Reset Password
      </Button>
    </Flex>
  )
}

export default AppAccount
