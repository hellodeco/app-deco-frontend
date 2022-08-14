import React from 'react'
import { Navigate } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'
import Userfront from '@userfront/core'
import AccountNav from '../components/AccountNav'

export interface AuthedRouteProps {
  outlet: JSX.Element
}

function AuthedRoute({
  outlet,
}: AuthedRouteProps) {
  const isAuthenticated = Userfront.accessToken()
  const authenticationPath = '/'

  if (isAuthenticated) {
    return (
      <Flex>
        <AccountNav />
        {outlet}
      </Flex>
    )
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />
  }
}

export default AuthedRoute
