import React from 'react'
import { Box } from '@chakra-ui/react'
import NavBar from './NavBar'

function NavBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box maxW="920px" maxH="700px" mx="auto" mt="60px">
      <NavBar />
      {children}
    </Box>
  )
}

export default NavBarLayout
