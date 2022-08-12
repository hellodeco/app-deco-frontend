import React, { useCallback } from 'react'
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import Userfront from '@userfront/core'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_INTEGRATION,
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
} from '../../graphql/queries'
import { DROP_AND_MIGRATE_USERS_NOTION_DATABASE } from '../../graphql/mutations'
import { User } from '../../types/types'

interface NotionAuthProps {
  userData: User
}

export function NotionAuth(props: NotionAuthProps) {
  const { userData } = props
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const [formatNotionDatabase, formatNotionDatabaseData] = useMutation(
    DROP_AND_MIGRATE_USERS_NOTION_DATABASE,
  )

  const {
    isOpen: isFormatWarningModalOpen,
    onOpen: onFormatWarningModalOpen,
    onClose: onFormatWarningModalClose,
  } = useDisclosure()

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

  const notionDatabaseIsBeingFormatted =
    formatNotionDatabaseData?.loading === true

  // workspace connected and database chosen
  if (notionIntegrationData && notionDatabaseData) {
    if (notionDatabaseData.needsManualFormatting) {
      return (
        <Flex flexDir="column">
          {/* user needs to connect a different page that matches the correct Database format */}
        </Flex>
      )
    }

    if (notionDatabaseData.needsFormatting) {
      return (
        <>
          {notionDatabaseIsBeingFormatted ? (
            <Text>Formatting notion page...</Text>
          ) : (
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
          )}
          <Button
            w="300px"
            my="30px"
            onClick={onFormatWarningModalOpen}
            isActive={notionDatabaseIsBeingFormatted}
          >
            Format Notion DB
          </Button>
        </>
      )
    }

    return (
      <>
        {' '}
        <Tag
          mt="15px"
          width="-webkit-fit-content"
          size="lg"
          variant="solid"
          colorScheme="green"
        >
          Ready to receive email!
        </Tag>
        {/* Chakra's modal API is dumb as fuck and its just easier to define two entirely separate component trees for each modal rather than getting fancy with some abstraction */}
        {/* Change Notion page warning modal */}
        <Modal
          isOpen={isFormatWarningModalOpen}
          onClose={onFormatWarningModalClose}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Are you sure you want to proceed?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Continuing with the page format will delete all existing content
                in the shared page. Make sure you've saved anything important
                before proceeding!
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={onFormatWarningModalClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  handleFormatNotionDatabase()
                  onFormatWarningModalClose()
                }}
              >
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  return null
}
