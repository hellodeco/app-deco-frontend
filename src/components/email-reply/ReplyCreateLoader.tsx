import React, { useEffect, useCallback } from 'react'
import Userfront from '@userfront/core'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FullScreenContainer } from '../FullScreenContainer'
import { LoginRedirect } from './components/LoginRedirect'
import { ReplyError } from './components/ReplyError'
import { CREATE_EMAIL_REPLY_PAGE } from '../../graphql/mutations'

export function ReplyCreateLoader() {
  const { originalEmailUUID } = useParams()
  const [createEmailReplyPage, { data, loading, error }] = useMutation(
    CREATE_EMAIL_REPLY_PAGE
  )

  const handleCreatePage = useCallback(
    async () => {
      try {
        await createEmailReplyPage({
          variables: {
            originalEmailUUID,
          },
        })
      } catch (err) {
        console.debug(err)
      }
    },
    [createEmailReplyPage, originalEmailUUID]
  )

  useEffect(() => {
    handleCreatePage()
  }, [])

  // user not logged in
  if (!Userfront?.tokens?.accessToken) {
    return (
      <LoginRedirect />
    )
  }

  const notionPageUrl = data?.createEmailReplyPage?.notionPageUrl

  if (notionPageUrl) {
    let url = notionPageUrl
    if (navigator?.appVersion?.includes('Linux')) {
      url = notionPageUrl.replace(/^notion:\/\//, 'https://')
    }

    window.location = url

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
        heading="Error creating reply page!"
        error={error}
      />
    )
  }

  // TODO figure out a default state
  return null
}
