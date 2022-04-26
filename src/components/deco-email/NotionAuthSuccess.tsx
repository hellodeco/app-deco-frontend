import React, { useEffect } from 'react'

export const NotionAuthSuccess = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close()
    }, 2000)
  }, [])

  return (
    <div>Successfully connected to Notion!</div>
  )
}
