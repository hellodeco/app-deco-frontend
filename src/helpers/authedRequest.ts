import type { GenericObject } from '../types/types'
import apiFetch from './apiFetch'
import Userfront from '@userfront/core'

interface BaseOptions {
  route: string
  method?: string
  body?: GenericObject
}

export async function authedRequest<ResponseType>({
  route,
  method = 'GET',
  body,
}: BaseOptions): Promise<ResponseType | null> {
  /**
   * If the user is not logged in, getAccessTokenSilently will throw an error
   * and the token variable will not be populated with a token
   */
  // todo - handle error case here
  if (!Userfront.accessToken()) {
    return null
  }

  const requestOpts: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${Userfront.accessToken()}`,
      'Content-Type': 'application/json',
    },
  }

  if (body) {
    requestOpts.body = JSON.stringify(body)
  }

  const response = await apiFetch(route, requestOpts)

  return await response.json()
}
