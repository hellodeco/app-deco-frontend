import React, { useEffect } from 'react'
import Userfront from '@userfront/core'
import { useParams } from 'react-router-dom'


export function Attachments() {
  let { attachmentId, filename } = useParams()
  console.log('handling attachment...')
  useEffect(() => {
    // Userfront.tokens?.accessToken
    // Userfront.tokens?.refreshToken 
    let fileUrl = `${process.env.REACT_APP_API_URL}/files/attachments/${attachmentId}/${filename}?accessToken=${Userfront.tokens?.accessToken}`
    console.log(fileUrl)
    // @ts-ignore
    window.location = fileUrl
  }, [])

  return <div>
    Loading file...
  </div>
}
