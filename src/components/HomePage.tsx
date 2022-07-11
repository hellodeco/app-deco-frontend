import Userfront from '@userfront/core'
import { Heading } from '@chakra-ui/react'
import { Navigate } from 'react-router-dom'

function HomePage() {
  if (Userfront.accessToken()) {
    return <Navigate to={'/account'} />
  }

  return (
    <>
      <Heading size="md">
        Turn your Notion workspace into an email inbox
      </Heading>
      Login or Signup to start receiving emails straight to your Notion
      workspace!
    </>
  )
}

export default HomePage
