import React, { useEffect } from 'react'
import { useQuery } from '../hooks/useQuery'
import Userfront from '@userfront/core';

export function PasswordlessLogin() {
  const queryStrings = useQuery()

  useEffect(() => {
    const login = async () => {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      const uuid = params.get('uuid')

      await Userfront.login({
        method: 'linkk',
        uuid,
        token,
      })
    }

    login()
  }, [queryStrings]) 


  return (
    <div>
      Logging you in...
    </div>
  )
}
