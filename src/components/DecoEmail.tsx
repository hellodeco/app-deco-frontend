import React from 'react'
import { Flex } from '@chakra-ui/react'
import type { User } from '../types/types'
import { ManageDecoEmail } from './deco-email/ManageDecoEmail'
import { NotionAuth } from './deco-email/NotionAuth'
interface DecoEmailProps {
  userData: User
}

function DecoEmail({ userData }: DecoEmailProps) {
  return (
    <Flex flexDirection="column" w="100%">
      <ManageDecoEmail userData={userData} />
      <NotionAuth userData={userData} />
    </Flex>
  )
}

export default DecoEmail
