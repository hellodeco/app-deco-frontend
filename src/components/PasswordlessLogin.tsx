import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { usePasswordlessLogin } from '../hooks/usePasswordlessLogin'


export function PasswordlessLogin() {
  const { authError } = usePasswordlessLogin()

  if (authError) {
    return (
      <Flex>
        <Text>
          Sorry, there was some trouble logging you in...
        </Text>
      </Flex>
    )
  }

  return (
    <Flex>
      <Text>
        Logging you in...
      </Text>
    </Flex>
  )
}
