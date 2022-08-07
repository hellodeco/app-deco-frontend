import React from 'react'
import { Button, Flex } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function AppAuthentication() {
  let navigate = useNavigate()

  return (
    <Flex mt="12px" mr="80px" alignItems="flex-start">
      <Button variant="link" ml="24px" onClick={() => navigate('/login')}>
        Login
      </Button>
      <Button variant="link" ml="24px" onClick={() => navigate('/signup')}>
        Signup
      </Button>
    </Flex>
  )
}

export default AppAuthentication
