import React, { useEffect } from 'react'

export const NotionAuthFail = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close()
    }, 2000)
  }, [])


  return (
    <div>Something unexpected happened and we were unable to connect you to your Notion :(</div>
  )
}