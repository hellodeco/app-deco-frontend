import React, { useCallback, useState } from 'react'
import {
  Heading,
  Button,
  Tag,
  Link,
  Image,
  Text,
  Flex,
  Select,
  OrderedList,
  ListItem,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Userfront from '@userfront/core'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_INTEGRATION,
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
  CONNECTED_NOTION_PAGES,
} from '../../graphql/queries'
import {
  DROP_AND_MIGRATE_USERS_NOTION_DATABASE,
  SELECT_NOTION_DATABASE,
} from '../../graphql/mutations'

interface NotionPage {
  id: string
  title: string
  url: string
  icon: {
    type: string
    emoji: string
    url: string
  }
}

function NotionSharedDBSelector({
  refetchNotionDatabaseInfo,
}: {
  refetchNotionDatabaseInfo: () => Promise<void>
}) {
  const [selectedPageId, setSelectedPageId] = useState('')
  const { data, loading, error } = useQuery(CONNECTED_NOTION_PAGES)
  const [selectNotionDatabase, selectedNotionDatabaseData] = useMutation(
    SELECT_NOTION_DATABASE,
  )

  if (loading) {
    return null
  }

  return (
    <Flex flexDir="column">
      <Heading size="md">Select Your Notion Page</Heading>
      <Text>
        Deco currently supports sending email to one Notion page at a time.
        Choose the shared Notion page you would like to send emails to.
      </Text>
      <Select
        placeholder="Select shared database"
        onChange={(event) => {
          setSelectedPageId(event.target.value)
        }}
      >
        {data?.connectedNotionPages?.map((page: NotionPage) => {
          let { title, icon } = page

          let optionText = ''
          if (icon.emoji) {
            optionText += icon.emoji
            optionText += ' '
          }

          optionText += title

          return (
            <option key={page.id} value={page.id}>
              {optionText}
            </option>
          )
        })}
      </Select>
      <Button
        disabled={!Boolean(selectedPageId)}
        onClick={async () => {
          // set the selected page in the db
          await selectNotionDatabase({
            variables: {
              databaseId: selectedPageId,
            },
          })

          await refetchNotionDatabaseInfo()
        }}
        width="200px"
        mt="30px"
      >
        Select database
      </Button>
    </Flex>
  )
}

export function NotionAuth() {
  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const [formatNotionDatabase, formatNotionDatabaseData] = useMutation(
    DROP_AND_MIGRATE_USERS_NOTION_DATABASE,
  )

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

  const handleFormatNotionDatabase = async () => {
    await formatNotionDatabase()
    await notionDatabase.refetch()
  }

  if (notionIntegration.loading || notionDatabase.loading) {
    return <span>Loading notion data...</span>
  }

  const notionIntegrationData =
    notionIntegration.data?.getCurrentUserNotionIntegration
  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo

  console.log({
    notionIntegration,
    notionDatabase,
  })

  // https://lh4.googleusercontent.com/-vWnhsGlh1aw/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuckkw7AMUjMyz0hNqLai5Ajs9PdJbQ/photo.jpg

  if (!notionIntegrationData) {
    // show notion connect button
    return (
      <>
        <Heading size="md">Connect your Notion Account</Heading>
        <Button w="300px" my="30px" onClick={handleAuthWithNotion}>
          Connect to Notion
        </Button>
      </>
    )
  }

  if (notionIntegration && !notionDatabaseData) {
    // show shared database selector
    return (
      <NotionSharedDBSelector
        refetchNotionDatabaseInfo={async () => {
          await notionDatabase.refetch()
        }}
      />
    )
  }

  // this should be the completely connected state
  if (notionIntegrationData && notionDatabaseData) {
    return (
      <>
        <Heading size="md">Notion Settings</Heading>

        {formatNotionDatabaseData?.loading && <>Formatting your notion db...</>}

        <Heading my="15px" size="sm">
          Connected Workspace
        </Heading>

        <Flex flexDir="row" alignItems="flex-end">
          {notionIntegrationData.workspaceIcon && (
            <Image
              src={notionIntegrationData.workspaceIcon}
              alt="notion workspace icon"
              height="40px"
            />
          )}
          <Text ml="10px">{notionIntegrationData.workspaceName}</Text>
        </Flex>

        <Heading mt="15px" size="sm">
          Connected Database
        </Heading>

        <Link mt="15px" href={notionDatabaseData.url} isExternal>
          {notionDatabaseData.icon} {notionDatabaseData.title}{' '}
          <ExternalLinkIcon mx="2px" mb="6px" />
        </Link>

        {notionDatabaseData.needsManualFormatting ? (
          <Flex flexDir="column">
            <Tag
              mt="15px"
              width="-webkit-fit-content"
              size="lg"
              variant="solid"
              padding="7px"
              colorScheme="gray"
            >
              ⚠️ It looks like you've shared a Notion page with us that isn't
              formatted as a database.
            </Tag>
            <Text my="13px">
              Unfortunately due to Notion limitations we can't do this for you
              😢 You can{' '}
              <Link
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                isExternal
                mt="17px"
              >
                watch a short video to learn how to format your Notion page
                <ExternalLinkIcon mx="2px" mb="6px" /> or follow the
                instructions here:
              </Link>
              <OrderedList my="13px">
                <ListItem>Delete all contents in the Page</ListItem>
                <ListItem>Select "Database" {'->'} "Table"</ListItem>
                <ListItem>Click "New database" on the right hand side</ListItem>
              </OrderedList>
              Once done, return here and refresh the page to continue.
            </Text>
          </Flex>
        ) : notionDatabaseData.needsFormatting ? (
          <>
            <Tag
              mt="15px"
              width="-webkit-fit-content"
              size="lg"
              variant="solid"
              colorScheme="red"
            >
              Not ready to receive email! Please format your database using the
              button below.
            </Tag>
            <Button
              w="300px"
              my="30px"
              onClick={() => handleFormatNotionDatabase()}
            >
              Format Notion DB
            </Button>
          </>
        ) : (
          <Tag
            mt="15px"
            width="-webkit-fit-content"
            size="lg"
            variant="solid"
            colorScheme="green"
          >
            Ready to receive email!
          </Tag>
        )}

        <Button w="300px" my="30px" onClick={handleAuthWithNotion}>
          Change Connected Notion Page
        </Button>
      </>
    )
  }

  return null
}
