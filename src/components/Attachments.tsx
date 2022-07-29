import React, { useEffect } from 'react'
import Userfront from '@userfront/core'
import { useParams } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'

export function Attachments() {
  const { attachmentId, filename } = useParams()
  const [fileUrl, setFileUrl] = React.useState<null | string>(null)
  useEffect(() => {
    let fileUrl = `${process.env.REACT_APP_API_URL}/files/attachments/${attachmentId}/${filename}?authToken=${Userfront.tokens?.accessToken}`
    setFileUrl(fileUrl)
  }, [attachmentId, filename, setFileUrl])

  if (!fileUrl) {
    return (
      <div>loading...</div>
    )
  }

  return (
    <Flex width="100vw" height="100vh">
      <iframe width="100%" height="100%" title="file preview" src={fileUrl} />
    </Flex>
  )
}
