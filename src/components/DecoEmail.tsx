import React from 'react'
import {
  Alert,
  AlertTitle,
  AlertDescription,
  Divider,
  Flex,
  Heading,
  Link,
} from '@chakra-ui/react'
import type { User } from '../types/types'
import { ManageDecoEmail } from './deco-email/ManageDecoEmail'
import { NotionAuth } from './deco-email/NotionAuth'
interface DecoEmailProps {
  userData: User
}

function DecoEmail({ userData }: DecoEmailProps) {
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const handleStripeBillingPortal = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userfrontUserId: userData?.userfrontID,
        email: userData?.signupEmail,
      }),
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/stripe/checkout-session`,
      payload,
    )

    if (response.status !== 200) {
      console.log('Error opening Stripe billing portal')
      return
    }

    const resBody = await response.json()
    window.location = resBody.sessionUrl
  }

  return (
    <Flex flexDirection="column" w="100%">
      <Heading size="xl">Manage Deco Email</Heading>

      {paywallEnabled && (
        <Alert status="error" mt="30px">
          <AlertTitle>Looks like you don't have a subscription!</AlertTitle>
          <AlertDescription>
            <Link
              color="blue.dark"
              onClick={(e) => handleStripeBillingPortal(e)}
            >
              Click here
            </Link>{' '}
            to get started.
          </AlertDescription>
        </Alert>
      )}
      <Divider my="30px" />
      <ManageDecoEmail userData={userData} />
      <NotionAuth userData={userData} />
    </Flex>
  )
}

export default DecoEmail
