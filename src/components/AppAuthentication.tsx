import React from 'react'
import { Button, Flex } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'

function AppAuthentication() {
  let navigate = useNavigate()
  let location = useLocation()
  return (
    <Flex mt="12px" mr="80px" alignItems="flex-start">
      <Button
        color="black"
        variant="link"
        ml="24px"
        onClick={() => navigate('/login')}
        textDecoration={location.pathname === '/login' ? 'underline' : 'false'}
      >
        Login
      </Button>
      <Button
        color="black"
        variant="link"
        ml="24px"
        onClick={() => navigate('/signup')}
        textDecoration={location.pathname === '/signup' ? 'underline' : 'false'}
      >
        Signup
      </Button>
    </Flex>
  )
}

export default AppAuthentication
