import React, { useCallback } from 'react'
import {
  Heading,
  Button,
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
import { useQuery } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_INTEGRATION,
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
} from '../../graphql/queries'
import { User } from '../../types/types'

interface NotionAuthProps {
  userData: User
}

const NotionReselectDatabase = (props: NotionAuthProps) => {
  const { userData } = props
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const {
    isOpen: isChangeWarningModalOpen,
    onOpen: onChangeWarningModalOpen,
    onClose: onChangeWarningModalClose,
  } = useDisclosure()

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

  const renderChangeConnectedPageWarningModal = () => {
    return (
      <Modal
        isOpen={isChangeWarningModalOpen}
        onClose={onChangeWarningModalClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to proceed?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Changing the connected Notion page will temporarily interrupt
              email delivery until you have finished setting up the new page.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onChangeWarningModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleAuthWithNotion()
                onChangeWarningModalClose()
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  if (!userData?.emailAddress) {
    return null
  }

  return (
    <Flex direction={'column'} my="15px">
      <Text fontSize="lg" fontWeight={'bold'} py="5px">
        Changed your mind?
      </Text>
      <Button
        color={'white'}
        backgroundColor={'blue.dark'}
        border={'1px solid blue.light'}
        _hover={{ backgroundColor: 'blue.light' }}
        onClick={onChangeWarningModalOpen}
        disabled={paywallEnabled}
      >
        Connect a different Notion page
      </Button>
      {/* Change Notion page warning modal */}
      {renderChangeConnectedPageWarningModal()}
    </Flex>
  )
}

export default NotionReselectDatabase
