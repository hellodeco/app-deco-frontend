import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'
import Userfront from '@userfront/core'
import AppAuthentication from './AppAuthentication'

function NavBar() {
  // if (Userfront.accessToken()) {
  //   return (
  //     <Flex
  //       flexDirection="column"
  //       alignContent="center"
  //       justifyContent="center"
  //     >
  //       <Flex
  //         alignItems="flex-start"
  //         justifyContent="space-between"
  //         height="120px"
  //         width="100%"
  //       >
  //         <Heading color="black">Your Hellodeco Account</Heading>
  //       </Flex>
  //     </Flex>
  //   )
  // }

  return <AppAuthentication />
}

export default NavBar
