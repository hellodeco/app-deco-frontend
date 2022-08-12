import React, { useEffect } from 'react'
import {
  Divider,
  Heading,
  Text,
  Flex,
  Select,
  Image,
  Link,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CONNECTED_NOTION_PAGES } from '../../graphql/queries'
import { SELECT_NOTION_DATABASE } from '../../graphql/mutations'
import { User } from '../../types/types'
import NotionReselectDatabase from './NotionReselectDatabase'
import envelopeNotionConnected from '../../media/envelope-notion-connected.png'

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

interface NotionAuthProps {
  userData: User
  notionDatabase: any
  notionIntegration: any
}

const NotionSelectDatabase = (props: NotionAuthProps) => {
  const { userData, notionDatabase, notionIntegration } = props
  const [getConnectedNotionPages, { data, loading }] = useLazyQuery(
    CONNECTED_NOTION_PAGES,
    {
      fetchPolicy: 'cache-and-network',
    },
  )

  useEffect(() => {
    getConnectedNotionPages()
  }, [notionIntegration, getConnectedNotionPages])

  const [selectNotionDatabase] = useMutation(SELECT_NOTION_DATABASE)
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo

  if (!userData?.emailAddress || !notionIntegration.data) {
    return null
  }

  if (notionDatabaseData && !notionDatabaseData.needsManualFormatting) {
    return (
      <>
        <Flex my="20px">
          <Image
            maxWidth={'200px'}
            src={envelopeNotionConnected}
            alt="A stylized illustration of a person putting an envelope in a box"
          />
          <Flex ml="20px" direction={'column'} justifyContent="center">
            <Text my="10px" fontWeight={'bold'} fontSize={'lg'}>
              Notion database connected
            </Text>
            <Text py="5px">
              Database name:{' '}
              <Link
                isExternal
                color={'blue.dark'}
                textAlign="center"
                fontSize={'md'}
                href={notionDatabaseData.url}
                variant={''}
              >
                {notionDatabaseData.icon} {notionDatabaseData.title}
              </Link>{' '}
            </Text>
            <NotionReselectDatabase userData={userData} />
          </Flex>
        </Flex>

        <Divider my="30px" />
      </>
    )
  }

  return (
    <Flex flexDir="column">
      <Heading size="lg">Step Three - almost there!</Heading>
      {notionDatabaseData && notionDatabaseData.needsManualFormatting && (
        <Alert
          status="error"
          flexDirection={'column'}
          alignItems={'flex-start'}
          mt="15px"
        >
          <AlertTitle>The page you selected is not a database.</AlertTitle>
          <AlertDescription>
            Try choosing a different option from the dropdown.
          </AlertDescription>
        </Alert>
      )}
      <Text my="15px">
        Select the database you created in Step Two from the dropdown below.
        This will tell us exactly where to send your email!
      </Text>
      <Select
        w="450px"
        _hover={{
          cursor: 'pointer',
        }}
        disabled={paywallEnabled}
        placeholder="Select shared database..."
        onChange={async (event) => {
          await selectNotionDatabase({
            variables: {
              databaseId: event.target.value,
            },
          })

          await notionDatabase.refetch()
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

      <Divider my="30px" />
    </Flex>
  )
}

export default NotionSelectDatabase
