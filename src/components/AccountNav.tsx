import React from 'react'
import { Button, Flex, Image } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import Userfront from '@userfront/core'
import exitDoor from '../media/door-exitdeco.svg'
import mailbox from '../media/mailboxdeco.svg'
import user from '../media/userdeco.svg'
import help from '../media/help.svg'

function AccountNav() {
  let navigate = useNavigate()
  let location = useLocation()

  return (
    <Flex flexDirection="column" width="300px" alignItems={'flex-start'}>
      <Button
        color="black"
        variant="link"
        mb="20px"
        p="5px"
        onClick={() => navigate('/email')}
        textDecoration={location.pathname === '/email' ? 'underline' : 'false'}
      >
        <Image src={mailbox} marginRight="5px" />
        Email
      </Button>
      <Button
        color="black"
        variant="link"
        mb="20px"
        p="5px"
        onClick={() => navigate('/account')}
        textDecoration={
          location.pathname === '/account' ? 'underline' : 'false'
        }
      >
        <Image src={user} marginRight="5px" />
        Account
      </Button>
      <Button
        color="black"
        variant="link"
        mb="20px"
        p="5px"
        onClick={() => navigate('/help')}
      >
        <Image src={help} marginRight="5px" />
        How it works
      </Button>
      <Button
        color="black"
        variant="link"
        mb="20px"
        p="5px"
        onClick={() => Userfront.logout()}
      >
        <Image src={exitDoor} marginRight="5px" />
        Logout
      </Button>
    </Flex>
  )
}

export default AccountNav
