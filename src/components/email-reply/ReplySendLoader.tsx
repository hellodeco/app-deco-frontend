import React, { useEffect, useCallback } from 'react'
import Userfront from '@userfront/core'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FullScreenContainer } from '../FullScreenContainer'
import { LoginRedirect } from './components/LoginRedirect'
import { ReplyError } from './components/ReplyError'
import { SEND_EMAIL_REPLY } from '../../graphql/mutations'

export function ReplySendLoader() {
  const { originalEmailUUID, notionPageID } = useParams()
  const [sendEmailReply, { data, loading, error }] =
    useMutation(SEND_EMAIL_REPLY)

  const handleSendReply = useCallback(async () => {
    try {
      await sendEmailReply({
        variables: {
          originalEmailUUID,
          notionPageID,
        },
      })
    } catch (err) {
      console.debug(err)
    }
  }, [sendEmailReply, originalEmailUUID, notionPageID])

  useEffect(() => {
    handleSendReply()
  }, [])

  // user not logged in
  if (!Userfront?.tokens?.accessToken) {
    return <LoginRedirect />
  }

  const inboxPageURL = data?.sendEmailReply?.inboxPageURL

  if (inboxPageURL) {
    let url = inboxPageURL
    if (navigator?.appVersion?.includes('Linux')) {
      url = inboxPageURL.replace(/^notion:\/\//, 'https://')
    }
    window.location = url 
    return null
  }

  if (loading) {
    return (
      <FullScreenContainer>
        <h1 className="text-xl">Sending your reply from Notion...</h1>
      </FullScreenContainer>
    )
  }

  if (error) {
    return <ReplyError heading="Error sending email reply!" error={error} />
  }

  // TODO figure out a default state
  return null
}
