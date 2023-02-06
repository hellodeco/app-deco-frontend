import React from 'react'
import { ApolloError } from '@apollo/client'
import { FullScreenContainer } from '../../FullScreenContainer'

const PUBLIC_URL = process.env.PUBLIC_URL

export function ReplyError({
  heading,
  error,
}: {
  heading: string
  error: ApolloError
}) {
  return (
    <FullScreenContainer>
      <img
        src={`${PUBLIC_URL}/lost-the-way.png`}
        width="300px"
        height="300px"
        alt="Know-it-all holding book and pointing into the air while looking self satisfied"
      />
      <h1 className="text-xl">{heading}</h1>
      <div className="border-2 rounded-lg p-6 m-6 bg-slate-100">
        <p>{error?.message}</p>
      </div>
      <p>Please send us an email at{' '}<a href="mailto:support@hellodeco.so" className="text-blue-500">support@hellodeco.so</a>{' '}and we'll get it sorted. 🙏</p>
    </FullScreenContainer>
  )
}
