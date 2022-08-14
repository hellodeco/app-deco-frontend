import React from 'react'
import AppAuthentication from '../AppAuthentication'
import Userfront from '@userfront/core'
import LayoutWrapper from './components/LayoutWrapper'
import AppTopBar from './components/AppTopBar'

function TopNavigationLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = Userfront.accessToken()

  return (
    <LayoutWrapper>
      <AppTopBar>{!isAuthenticated && <AppAuthentication />}</AppTopBar>
      {children}
    </LayoutWrapper>
  )
}

export default TopNavigationLayout
