import React from 'react'
import {
  Heading,
  Button,
  Tag,
  Divider,
  Image,
  Text,
  Flex,
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
import pleasantSurprise from '../../media/pleasant-surprise.png'

interface NotionAuthProps {
  userData: User
}

const NotionSuccessOrFormat = (props: NotionAuthProps) => {
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

  const notionIntegrationData =
    notionIntegration.data?.getCurrentUserNotionIntegration
  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo

  const notionDatabaseIsBeingFormatted =
    formatNotionDatabaseData?.loading === true

  // workspace connected and database chosen
  if (notionIntegrationData && notionDatabaseData) {
    // user connected a Notion page that is not a database
    if (notionDatabaseData.needsManualFormatting) {
      return (
        <Flex flexDir="column">
          {/* user needs to connect a different page that matches the correct Database format */}
        </Flex>
      )
    }

    // database is connected but is not formatted - user needs to click "format" button
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
                  Continuing with the page format will delete all existing
                  content in the shared page. Make sure you've saved anything
                  important before proceeding!
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

    // no issues with connected database, user is all set
    return (
      <>
        <Heading size="lg"> Congrats! You're all set </Heading>
        <Text my="10px">
          Get out there and enjoy the refreshingly modern experience of managing
          email in Notion.
        </Text>
        <Flex justifyContent={'center'}>
          <Image
            src={pleasantSurprise}
            alt="A stylized illustration of an excited woman receiving a gift wrapped box"
            maxWidth={'250px'}
          />
        </Flex>

        <Divider my="30px" />
      </>
    )
  }

  // either workspace not connected or database is not selected or both
  return null
}

export default NotionSuccessOrFormat
