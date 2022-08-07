import React from 'react'
import { Button, Flex, Image, Link } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import HelloDecoFontLogo from '../media/hellodeco-logo-2.svg'

function AppAuthentication() {
  let navigate = useNavigate()

  return (
    <Flex flexDirection="column" alignContent="center" justifyContent="center">
      <Flex
        alignItems="flex-start"
        justifyContent="space-between"
        height="60px"
        width="100%"
      >
        <Link href="https://hellodeco.so">
          <Image src={HelloDecoFontLogo} alt="HelloDeco Font Logo" />
        </Link>

        <Flex mt="12px">
          <Button variant="link" ml="24px" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="link" ml="24px" onClick={() => navigate('/signup')}>
            Signup
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default AppAuthentication
