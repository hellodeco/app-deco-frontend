import React, { useState } from 'react'
import Userfront from '@userfront/core'
import { useParams, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FullScreenContainer } from './FullScreenContainer'
import { CREATE_EMAIL_REPLY_PAGE } from '../graphql/mutations'

const PUBLIC_URL = process.env.PUBLIC_URL

export function ReplyCreateLoader() {
  const { originalEmailUUID } = useParams()
  const location = useLocation()
  const [pageCreated, setPageCreated] = useState(false)
  const [createEmailReplyPage, { data, loading, error }] = useMutation(
    CREATE_EMAIL_REPLY_PAGE
  )

  const handleCreatePage = async () => {
    try {
      const resp = await createEmailReplyPage({
        variables: {
          originalEmailUUID,
        },
      })

      console.log(resp)
      setPageCreated(true)
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
      <FullScreenContainer>
        <h1>Error creating reply page in Notion...</h1>
      </FullScreenContainer>
    )
  }

  if (!pageCreated) {
    // TODO make sure that we do not accidentally fire this off a shitload of times.
    handleCreatePage()
  }

  // TODO make a query to determine if use has access to the email. OR just return an error from createEmailReplyPage mutation

  return null
}
