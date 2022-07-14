import React, { useCallback, useState } from 'react'
import { Heading, Button, Tag, Link, Image, Text, Flex, Select } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import Userfront from '@userfront/core'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_INTEGRATION,
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
  CONNECTED_NOTION_PAGES,
} from '../../graphql/queries'
import { DROP_AND_MIGRATE_USERS_NOTION_DATABASE, SELECT_NOTION_DATABASE } from '../../graphql/mutations'


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

function NotionSharedDBSelector({ refetchNotionDatabaseInfo }: { refetchNotionDatabaseInfo: () => Promise<void> }) {
  const [selectedPageId, setSelectedPageId] = useState('')
  const { data, loading, error } = useQuery(CONNECTED_NOTION_PAGES)
  const [selectNotionDatabase, selectedNotionDatabaseData] = useMutation(
    SELECT_NOTION_DATABASE,
  )

  // console.log({ selectedPageId, data, loading, error, selectedNotionDatabaseData })

  if (loading) {
    return null
  }

  return (
    <Flex
      flexDir="column"
    >
      <Select
        placeholder='Select shared database'
        onChange={(event) => {
          console.log({ value: event.target.value })
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
            <option key={page.id} value={page.id}>{optionText}</option>
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
            }
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

  if (notionDatabaseData.needsManualFormatting) {
    // prompt user to manually format their selected notion page

    // give a link to database and instructions on what to do

    return (
      <>
        <Heading size="md">Your Connected Notion Page</Heading>

        <Heading mt="15px" size="sm">
          Status:
        </Heading>
        <Flex flexDir="column">
          <Tag
            mt="15px"
            width="-webkit-fit-content"
            size="lg"
            variant="solid"
            colorScheme="red"
          >
            Your Notion page needs to be formatted manually.
          </Tag>

          <Heading mt="15px" size="sm">
            Database:
          </Heading>

          <Link mt="15px" href={notionDatabaseData.url} isExternal>
            {notionDatabaseData.icon} {notionDatabaseData.title}{' '}
            <ExternalLinkIcon mx="2px" />
          </Link>

          <Text>
            Instructions how to do this will go here............
          </Text>

          <Button
            w="300px"
            my="30px"
            onClick={async () => {
              await notionDatabase.refetch()
            }} 
          >
            Check formatting again
          </Button>

          <Button
            w="300px"
            my="30px"
            onClick={async () => {
              // TODO
            }} 
          >
            Select another shared database
          </Button>

          <Button
            w="300px"
            my="30px"
            onClick={handleAuthWithNotion}
          >
            Connect a new database
          </Button>
        </Flex>
      </>
    )
  }

  if (notionIntegrationData && notionDatabaseData.needsFormatting) {
    // show button to format
  }

  // else show the successful / completed connection UI



  // this should be the completely connected state
  if (notionIntegrationData && notionDatabaseData) {
    return (
      <>
        <Heading size="md">Your Connected Notion Page</Heading>

        <Heading mt="15px" size="sm">
          Status:
        </Heading>

        {!notionDatabaseData.needsFormatting ? (
          <Tag
            mt="15px"
            width="-webkit-fit-content"
            size="lg"
            variant="solid"
            colorScheme="green"
          >
            Ready to receive email!
          </Tag>
        ) : (
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
        )}

        {formatNotionDatabaseData?.loading && <>Formatting your notion db...</>}

        <Heading my="15px" size="sm">
          Workspace:
        </Heading>

        <Flex flexDir="row" alignItems="flex-end">
          <Image
            src={notionIntegrationData.workspaceIcon}
            alt="notion workspace icon"
            height="40px"
          />
          <Text ml="10px">{notionIntegrationData.workspaceName}</Text>
        </Flex>

        <Heading mt="15px" size="sm">
          Database:
        </Heading>

        <Link mt="15px" href={notionDatabaseData.url} isExternal>
          {notionDatabaseData.icon} {notionDatabaseData.title}{' '}
          <ExternalLinkIcon mx="2px" />
        </Link>

        <Button w="300px" my="30px" onClick={handleAuthWithNotion}>
          Change Connected Notion Page
        </Button>
      </>
    )
  }

  return null
}
