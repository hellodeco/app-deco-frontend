import React, { useEffect } from 'react'
import Userfront from '@userfront/core'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { HAS_FILE_ACCESS } from '../graphql/queries'

const PUBLIC_URL = process.env.PUBLIC_URL

function FullScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen items-center justify-center flex flex-col">
      {children}
    </div>
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
        <h1>loading...</h1>
      </FullScreenContainer>
    )
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
          to view file.
        </p>
      </FullScreenContainer>
    )
  }

  // user logged in and doesn't have access to file
  if (!data?.currentUserHasFileAccess) {
    return (
      <FullScreenContainer>
        <img
          src={`${PUBLIC_URL}/lost-the-way.png`}
          width="300px"
          height="300px"
          alt="Lost person looking at direction signs"
        />
        <h2 className="font-bold text-lg">
          Uh-oh, looks like you don't have access to this file!
        </h2>
        <p>
          If you think this is a mistake, try{' '}
          <a href={'/login'} className="text-sky-700 underline">
            logging in
          </a>{' '}
          or{' '}
          <a href="/signup" className="text-sky-700 underline">
            create an account
          </a>{' '}
          to get started using Deco.
        </p>
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
