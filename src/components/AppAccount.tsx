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
    await Userfront.sendResetLink(userData?.signupEmail)
  }

  const paywallEnabled = userData?.subscriptionStatus !== 'active'
  console.log(paywallEnabled)

  return (
    <Flex flexDirection="column" mx="70px">
      <Heading size="xl">Account Details</Heading>
      <Divider my="30px" />
      <Heading size="md" mb="20px">
        Signup Information
      </Heading>
      Your signup email: {userData?.signupEmail}
      <Divider my="30px" />
      <Heading size="md" mb="20px">
        Manage Billing
      </Heading>
      <Button width="300px" onClick={handleStripeBillingPortal}>
        {paywallEnabled ? 'Purchase Subscription' : 'Open Billing Portal'}
      </Button>
      <Divider my="30px" />
      <Heading size="md" mb="20px">
        Manage Password
      </Heading>
      The reset password option will email you a link to reset your password.
      <Button width="300px" my="20px" onClick={handlePasswordReset}>
        Reset Password
      </Button>
    </Flex>
  )
}

export default AppAccount
