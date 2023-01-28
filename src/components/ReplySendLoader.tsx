import React, { useState } from 'react'
import Userfront from '@userfront/core'
import { useParams, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FullScreenContainer } from './FullScreenContainer'
import { SEND_EMAIL_REPLY } from '../graphql/mutations'

const PUBLIC_URL = process.env.PUBLIC_URL

export function ReplySendLoader() {
  const { originalEmailUUID, notionPageID } = useParams()
  const location = useLocation()
  const [replySent, setReplySent] = useState(false)
  const [sendEmailReply, { data, loading, error }] = useMutation(
    SEND_EMAIL_REPLY,
  )

  const handleSendReply = async () => {
    try {
      const resp = await sendEmailReply({
        variables: {
          originalEmailUUID,
          notionPageID,
        },
      })

      console.log(resp)
      setReplySent(true)
    } catch (err) {
      console.error(err)
    }
  }

  // user not logged in
  if (!Userfront?.tokens?.accessToken) {
    let href = `/login?redirect_to=${encodeURIComponent(location.pathname)}`
    return (
      <FullScreenContainer>
        <img
          src={`${PUBLIC_URL}/schoolgirl.png`}
          width="300px"
          height="300px"
          alt="Know-it-all holding book and pointing into the air while looking self satisfied"
        />
        <h2 className="font-bold text-lg">You are not logged in!</h2>
        <p>
          Please{' '}
          <a href={href} className="text-sky-700 underline">
            login
          </a>{' '}
          to send email reply.
        </p>
      </FullScreenContainer>
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
        <h1>Creating reply page in Notion...</h1>
      </FullScreenContainer>
    )
  }

  if (error) {
    return (
      <FullScreenContainer>
        <h1>Error creating reply page in Notion...</h1>
      </FullScreenContainer>
    )
  }

  if (!replySent) {
    // TODO make sure that we do not accidentally fire this off a shitload of times.
    handleSendReply()
  }


  return null
}
