import React, { useEffect } from 'react'
import Userfront from '@userfront/core'
import { Text, Link, Image } from '@chakra-ui/react'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Flex } from '@chakra-ui/react'
import { HAS_FILE_ACCESS } from '../graphql/queries'

const PUBLIC_URL = process.env.PUBLIC_URL

function FullScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      {children}
    </Flex>
  )
}

export function Attachments() {
  const { attachmentId, filename } = useParams()
  const location = useLocation()
  const [fileUrl, setFileUrl] = React.useState<string>()
  const { data, loading, error } = useQuery(HAS_FILE_ACCESS, {
    variables: {
      attachmentId: attachmentId,
    },
  })

  useEffect(() => {
    let fileUrl = `${process.env.REACT_APP_API_URL}/files/attachments/${attachmentId}/${filename}?authToken=${Userfront.tokens?.accessToken}`
    setFileUrl(fileUrl)
  }, [attachmentId, filename, setFileUrl])

  if (!fileUrl || loading) {
    return (
      <FullScreenContainer>
        <Text fontSize="1.5rem">loading...</Text>
      </FullScreenContainer>
    )
  }

  // user not logged in
  if (!Userfront?.tokens?.accessToken) {
    let href = `/login?redirect_to=${encodeURIComponent(location.pathname)}`
    return (
      <FullScreenContainer>
        <Image
          src={`${PUBLIC_URL}/schoolgirl.png`}
          width="300px"
          height="300px"
          alt="Know-it-all holding book and pointing into the air while looking self satisfied"
        />
        <Text fontSize="1.5rem">You are not logged in!</Text>
        <Text>
          Please{' '}
          <Link href={href} color="blue.light">
            login
          </Link>{' '}
          to view file.
        </Text>
      </FullScreenContainer>
    )
  }

  // user logged in and doesn't have access to file
  if (!data?.currentUserHasFileAccess) {
    return (
      <FullScreenContainer>
        <Image
          src={`${PUBLIC_URL}/lost-the-way.png`}
          width="300px"
          height="300px"
          alt="Lost person looking at direction signs"
        />
        <Text fontSize="1.5rem">
          Uh-oh, looks like you don't have access to this file!
        </Text>
        <Text>
          If you think this is a mistake, try{' '}
          <Link href={'/login'} color="blue.light">
            logging in
          </Link>{' '}
          or{' '}
          <Link href="/signup" color="blue.light">
            create an account
          </Link>{' '}
          to get started using Deco.
        </Text>
      </FullScreenContainer>
    )
  }

  return (
    <FullScreenContainer>
      <iframe
        id="attachment-iframe"
        width="100%"
        height="100%"
        title="file preview"
        src={fileUrl}
      />
    </FullScreenContainer>
  )
}
