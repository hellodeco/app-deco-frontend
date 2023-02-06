import React, { useState } from 'react'
import Userfront from '@userfront/core'
import { useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FullScreenContainer } from '../FullScreenContainer'
import { LoginRedirect } from './components/LoginRedirect'
import { ReplyError } from './components/ReplyError'
import { SEND_EMAIL_REPLY } from '../../graphql/mutations'

export function ReplySendLoader() {
  const { originalEmailUUID, notionPageID } = useParams()
  const [replySent, setReplySent] = useState(false)
  const [sendEmailReply, { data, loading, error }] = useMutation(
    SEND_EMAIL_REPLY,
  )

  const handleSendReply = async () => {
    setReplySent(true)
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
  }

  // user not logged in
  if (!Userfront?.tokens?.accessToken) {
    return (
      <LoginRedirect />
    )
  }

  const notionPageUrl = data?.sendEmailReply?.notionPageUrl

  if (notionPageUrl) {
    window.location = notionPageUrl
    return null
  }

  if (loading) {
    return (
      <FullScreenContainer>
        <h1 className="text-xl">Sending email reply...</h1>
      </FullScreenContainer>
    )
  }

  if (error) {
    return (
      <ReplyError
        heading="Error sending email reply"
        error={error}
      />
    )
  }

  if (!replySent) {
    handleSendReply()
  }

  return null
}
