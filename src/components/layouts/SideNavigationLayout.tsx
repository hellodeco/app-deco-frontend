import React from 'react'
import { Flex } from '@chakra-ui/react'
import AccountNav from '../AccountNav'
import LayoutWrapper from './components/LayoutWrapper'
import AppTopBar from './components/AppTopBar'

interface SideNavigationLayoutProps {
  children: React.ReactNode
}

function SideNavigationLayout({ children }: SideNavigationLayoutProps) {
  return (
    <LayoutWrapper>
      <AppTopBar />
      <Flex>
        <AccountNav />
        {children}
      </Flex>
    </LayoutWrapper>
  )
}

export default SideNavigationLayout
