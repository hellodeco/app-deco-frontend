import React, { useCallback } from 'react'
import {
  Divider,
  Heading,
  Button,
  Link,
  Image,
  Text,
  Flex,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import Userfront from '@userfront/core'
import { useQuery } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_INTEGRATION,
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
} from '../../graphql/queries'
import { User } from '../../types/types'
import dealConnection from '../../media/big-deal-connection.png'

interface NotionAuthProps {
  userData: User
}

const NotionInitiateAuth = (props: NotionAuthProps) => {
  const { userData } = props
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)

  const handleAuthWithNotion = useCallback(() => {
    const params = new URLSearchParams()
    params.append('authToken', Userfront.tokens?.accessToken)
    const authUrl = `${
      process.env.REACT_APP_API_URL
    }/oauth/notion?${params.toString()}`
    const tab = window.open(authUrl, '_blank')
    tab?.focus()

    const interval = setInterval(() => {
      if (tab?.closed) {
        notionIntegration.refetch()
        notionDatabase.refetch()
        clearInterval(interval)
      }
    }, 300)
  }, [notionIntegration, notionDatabase])

  const notionIntegrationData =
    notionIntegration.data?.getCurrentUserNotionIntegration

  if (!userData?.emailAddress) {
    return null
  }

  if (notionIntegrationData) {
    return (
      <>
        <Flex mt="15px" alignItems="center">
          <Flex flexDir="column">
            <Text fontSize="lg" fontWeight={'bold'}>
              Notion workspace connected
            </Text>
            <Text fontSize={'lg'}>
              Name:{' '}
              {notionIntegrationData.workspaceIcon &&
                notionIntegrationData.workspaceIcon}{' '}
              {notionIntegrationData.workspaceName}
            </Text>
            <Text fontSize={'lg'}>
              Owner: {notionIntegrationData.userFullName}
            </Text>
            <Text fontSize={'lg'}>Email: {notionIntegrationData.email}</Text>
          </Flex>
          <Image
            ml="80px"
            maxWidth={'200px'}
            src={dealConnection}
            alt="A stylized illustration of a two men in business suits shaking hands"
          />
        </Flex>

        <Divider my="30px" />
      </>
    )
  }

  return (
    <>
      <Heading size="lg">Step Two - connect your Notion workspace</Heading>
      <Flex mt="15px" alignItems={'center'}>
        <Text py="10px" fontSize={'md'}>
          Before you start, you'll need to set up a blank database page in your
          Notion workspace. This page will become your Inbox!
        </Text>
        <Image
          ml="80px"
          maxWidth={'200px'}
          src={dealConnection}
          alt="A stylized illustration of a two men in business suits shaking hands"
        />
      </Flex>
      <UnorderedList>
        <ListItem>Open your Notion workspace</ListItem>
        <ListItem>Start by selecting "Add a page" in the left menu</ListItem>
        <ListItem>
          Instead of continuing with an empty page, choose the database "table"
          template
        </ListItem>
        <ListItem>
          Notion will ask you to choose a data source - select the very bottom
          option on the right, "New Database"
        </ListItem>
        <ListItem>
          If you're still not sure you got it right, you can{' '}
          <Link color="blue.dark">
            watch our Loom demonstrating the setup process
          </Link>
        </ListItem>
      </UnorderedList>
      <Text pt="20px" fontWeight={'bold'}>
        Completed the steps above? You're all set! Go ahead and click that
        button that says "Connect to Notion".
      </Text>
      <Button
        w="450px"
        my="30px"
        onClick={handleAuthWithNotion}
        disabled={paywallEnabled || !userData?.emailAddress}
        color={'white'}
        backgroundColor="blue.light"
        border={'1px solid blue.dark'}
        _hover={{ backgroundColor: 'blue.dark' }}
      >
        Connect to Notion
      </Button>

      <Divider my="30px" />
    </>
  )
}

export default NotionInitiateAuth
