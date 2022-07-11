import React from 'react'
import { Button, Flex } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Userfront from '@userfront/core'

function AccountNav() {
  let navigate = useNavigate()

  return (
    <Flex flexDirection="column" width="300px" alignItems={'flex-start'}>
      <Button variant="link" mb="24px" onClick={() => navigate('/email')}>
        Email
      </Button>
      <Button variant="link" mb="24px" onClick={() => navigate('/account')}>
        Account
      </Button>
      <Button variant="link" mb="24px" onClick={() => Userfront.logout()}>
        Logout
      </Button>
    </Flex>
  )
}

export default AccountNav
