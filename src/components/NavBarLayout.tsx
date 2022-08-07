import React from 'react'
import { Box, Link, Image, Flex } from '@chakra-ui/react'
import AppAuthentication from './AppAuthentication'
import Userfront from '@userfront/core'
import HelloDecoFontLogo from '../media/hellodeco-logo-2.svg'

function NavBarLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = Userfront.accessToken()

  return (
    <Box maxW="920px" maxH="700px" mx="auto" mt="60px">
      <Flex height="80px" width="100%" justifyContent="space-between">
        <Link href="https://hellodeco.so">
          <Image src={HelloDecoFontLogo} alt="HelloDeco Font Logo" />
        </Link>
        {!isAuthenticated && <AppAuthentication />}
      </Flex>
      {children}
    </Box>
  )
}

export default NavBarLayout
