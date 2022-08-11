import React from 'react'
import {
  Divider,
  Heading,
  Text,
  Flex,
  Select,
  Image,
  Tag,
  Link,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
  CONNECTED_NOTION_PAGES,
} from '../../graphql/queries'
import { SELECT_NOTION_DATABASE } from '../../graphql/mutations'
import { User } from '../../types/types'
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
}

const NotionSelectDatabase = (props: NotionAuthProps) => {
  const { userData } = props
  const { data, loading } = useQuery(CONNECTED_NOTION_PAGES, {
    fetchPolicy: 'cache-and-network',
  })
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const [selectNotionDatabase] = useMutation(SELECT_NOTION_DATABASE)
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo

  if (loading) {
    return null
  }

  if (notionDatabaseData) {
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
            <div>
              <Tag
                py="8px"
                color="white"
                backgroundColor={'blue.light'}
                justifyContent="center"
              >
                <Link
                  textAlign="center"
                  fontSize={'md'}
                  href={notionDatabaseData.url}
                >
                  {notionDatabaseData.icon} {notionDatabaseData.title}{' '}
                  <ExternalLinkIcon mx="2px" mb="6px" />
                </Link>
              </Tag>
            </div>
          </Flex>
        </Flex>

        <Divider my="30px" />
      </>
    )
  }

  return (
    <Flex flexDir="column">
      <Heading size="lg">Step Three - almost there!</Heading>
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
