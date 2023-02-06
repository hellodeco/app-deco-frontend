import React, { useState } from 'react'
import Userfront from '@userfront/core'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FullScreenContainer } from '../FullScreenContainer'
import { LoginRedirect } from './components/LoginRedirect'
import { ReplyError } from './components/ReplyError'
import { CREATE_EMAIL_REPLY_PAGE } from '../../graphql/mutations'

export function ReplyCreateLoader() {
  const { originalEmailUUID } = useParams()
  const [pageCreated, setPageCreated] = useState(false)
  const [createEmailReplyPage, { data, loading, error }] = useMutation(
    CREATE_EMAIL_REPLY_PAGE
  )

  const handleCreatePage = async () => {
    setPageCreated(true)
    try {
      await createEmailReplyPage({
        variables: {
          originalEmailUUID,
        },
      })
    } catch (err) {
      console.debug(err)
    }
  }

  // user not logged in
  if (!Userfront?.tokens?.accessToken) {
    return (
      <LoginRedirect />
    )
  }

  const notionPageUrl = data?.createEmailReplyPage?.notionPageUrl

  if (notionPageUrl) {
    window.location = notionPageUrl
    return null
  }

  if (loading) {
    return (
      <FullScreenContainer>
        <h1>Creating reply page in Notion...</h1>
      </FullScreenContainer>
    )
  }

  if (error) {
    return (
      <ReplyError
        heading="Error creating reply page in Notion"
        error={error}
      />
    )
  }

  if (!pageCreated) {
    handleCreatePage()
  }

  return null
}
