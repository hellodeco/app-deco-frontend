import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { useQuery } from '../hooks/useQuery'
import Userfront from '@userfront/core';

export function PasswordlessLogin() {
  const [authError, setAuthError] = useState(false)
  const queryStrings = useQuery()

  useEffect(() => {
    const login = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      const uuid = params.get('uuid')

      try {
        await Userfront.login({
          method: 'link',
          uuid,
          token,
        })
      } catch (err) {
        setAuthError(true)
        console.error(err)
      }
    }

    login()
  }, [queryStrings]) 

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
