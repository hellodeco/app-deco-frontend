import React from 'react'
import { Button } from '@chakra-ui/react'
import Userfront from '@userfront/core'

const LogoutButton = () => {
  const handleLogout = () => {
    Userfront.logout()
  }

  return (
    <>
      <Button onClick={() => handleLogout()} variant="link" p="10px">
        Logout
      </Button>
    </>
  )
}

export default LogoutButton
