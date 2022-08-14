import React from 'react'
import { Navigate } from 'react-router-dom'
import Userfront from '@userfront/core'

export interface AuthedRouteProps {
  children: JSX.Element
}

function AuthedRoute({ children }: AuthedRouteProps) {
  const isAuthenticated = Userfront.accessToken()
  const authenticationPath = '/'

  if (isAuthenticated) {
    return children
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />
  }
}

export default AuthedRoute
