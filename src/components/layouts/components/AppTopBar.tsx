import React from 'react'
import { Flex, Link, Image } from '@chakra-ui/react'
import HelloDecoFontLogo from '../../../media/hellodeco-logo-2.svg'

interface AppTopBarProps {
  children?: React.ReactNode
}

function AppTopBar({ children = null }: AppTopBarProps) {
  return (
    <Flex height="80px" width="100%" justifyContent="space-between">
      <Link href="https://hellodeco.so">
        <Image src={HelloDecoFontLogo} alt="HelloDeco Font Logo" />
      </Link>
      {children}
    </Flex>
  )
}

export default AppTopBar
