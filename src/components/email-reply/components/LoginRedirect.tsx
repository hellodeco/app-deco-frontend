import React from 'react'
import { useLocation } from 'react-router-dom'
import { FullScreenContainer } from '../../FullScreenContainer'

const PUBLIC_URL = process.env.PUBLIC_URL

export function LoginRedirect() {
  const location = useLocation()
  const href = `/login?redirect_to=${encodeURIComponent(location.pathname)}`

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
