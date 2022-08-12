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
import NotionSuccessOrFormat from './deco-email/NotionSuccessOrFormat'
import NotionInitiateAuth from './deco-email/NotionInitiateAuth'
import NotionSelectDatabase from './deco-email/NotionSelectDatabase'
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
      <Heading size="xl">Manage HelloDeco Email</Heading>

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
      <NotionInitiateAuth userData={userData} />
      <NotionSelectDatabase userData={userData} />
      <NotionSuccessOrFormat userData={userData} />
      {/* <Text pt="15px">
        HelloDeco provides you with a custom "@deco.so" email address of your
        choosing.
      </Text>
      <Text pt="15px">
        Any emails sent or forwarded to this address will be delivered directly
        into your Notion workspace, safely tucked into a database you designate
        as your inbox.
      </Text>
      <Text pt="15px">
        While Notion doesn't allow us to upload files to your workspace
        directly, we'll save any email attachments you recieve and make the link
        available in Notion for quick access.
      </Text>
      <Text pt="15px">
        Sending email is currently not supported, but it's next on our roadmap!
      </Text> */}
    </Flex>
  )
}

export default DecoEmail
