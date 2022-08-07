import React, { useEffect } from 'react'
import Userfront from '@userfront/core'
import { Text, Link } from '@chakra-ui/react'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Flex } from '@chakra-ui/react'
import { HAS_FILE_ACCESS } from '../graphql/queries'

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
        <Text fontSize="1.5rem">You are not logged in!</Text>
        <Text>
          Please{' '}
          <Link href={href} color="#F7CD45">
            Login
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
        <Text fontSize="1.5rem">
          Uh-oh, looks like you don't have access to this file!
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
