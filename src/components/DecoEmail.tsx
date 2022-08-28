import React from 'react'
import {
  Alert,
  AlertTitle,
  Text,
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
import { useQuery } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
  GET_CURRENT_USER_NOTION_INTEGRATION,
} from '../graphql/queries'
import { GET_USER_META } from '../graphql/queries'

function DecoEmail() {
  const { loading, data } = useQuery<{ currentUser: User }>(GET_USER_META)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)

  const userData = data?.currentUser
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

  if (loading) {
    return <Flex>Loading...</Flex>
  }

  return (
    <Flex flexDirection="column" w="100%" pb="100px">
      <Heading size="xl">Manage HelloDeco Email</Heading>

      {paywallEnabled && (
        <>
          <Alert
            status="warning"
            mt="30px"
            flexDir={'column'}
            alignItems="flex-start"
          >
            <AlertTitle>Heads up! You're still on our free plan.</AlertTitle>
            <Text>
              Our free plan limits you to 10 emails in your Notion inbox.
            </Text>
            <Text>
              Don't want to worry about email delivery?{' '}
              <Link
                color="blue.dark"
                onClick={(e) => handleStripeBillingPortal(e)}
              >
                Click here
              </Link>{' '}
              to upgrade.
            </Text>
          </Alert>
        </>
      )}
      <Divider my="30px" />

      <ManageDecoEmail userData={userData} />

      <NotionInitiateAuth
        userData={userData}
        notionDatabase={notionDatabase}
        notionIntegration={notionIntegration}
      />
      <NotionSelectDatabase
        userData={userData}
        notionDatabase={notionDatabase}
        notionIntegration={notionIntegration}
      />
      <NotionSuccessOrFormat
        userData={userData}
        notionDatabase={notionDatabase}
        notionIntegration={notionIntegration}
      />
    </Flex>
  )
}

export default DecoEmail
