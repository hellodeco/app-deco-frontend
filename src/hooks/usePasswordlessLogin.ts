import { useState, useEffect } from 'react'
import Userfront from '@userfront/core';
import { useQuery } from './useQuery'

export function usePasswordlessLogin() {
  const queryStrings = useQuery()
  const [authError, setAuthError] = useState<boolean>(false)

  useEffect(() => {
    const params = new URLSearchParams(queryStrings)
    const token = params.get('token')
    const uuid = params.get('uuid')

    if (!uuid && !token) {
      return
    }

    const login = async () => {
      try {
        await Userfront.login({
          method: 'link',
          uuid,
          token,
        })
      } catch (err) {
        setAuthError(true)
        console.error(err)
      }
    }

    login()
  }, [queryStrings]) 

  return {
    authError,
  }
}
