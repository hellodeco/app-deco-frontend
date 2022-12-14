import React from 'react'
import Userfront from '@userfront/core'
import { Navigate, useNavigate } from 'react-router-dom'
import mailmanIllustration from '../media/hellodeco-logo.png'
import HelloDecoFontLogo from '../media/hellodeco-logo-2.svg'

function getRedirectParam() {
  let params = new URLSearchParams(window.location.search)
  let redirectTo = params.get('redirect_to')

  if (!redirectTo) {
    return
  }

  return decodeURIComponent(redirectTo)
}

const LoginPage = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  let navigate = useNavigate()

  const handleLogin = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')

    Userfront.login({
      method: 'password',
      email: email,
      password: password,
      redirect: getRedirectParam(),
    }).catch((error: any) => {
      setErrorMessage(error.message)
    })
  }

  if (Userfront.accessToken()) {
    return <Navigate to={'/email'} />
  }

  return (
    <div className="flex mt-48 justify-center">
      <div className="w-1/4">
        <img
          className="h-8 w-auto"
          src={HelloDecoFontLogo}
          alt="Your Company"
        />
        <h2 className="mt-8 mb-4 text-xl font-bold">Sign in to your account</h2>
        <form action="#" method="POST" className="space-y-6 max-w-md">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600" id="password-error">
              {errorMessage}
            </p>
          )}

          <div>
            <button
              type="submit"
              onClick={(event) => handleLogin(event)}
              className="flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="mt-10">
          <div className="text-sm">
            <button
              onClick={() => navigate('/forgot-password')}
              className="font-medium underline text-sky-600 hover:text-sky-500"
            >
              Forgot password
            </button>
          </div>
          <div className="text-sm mt-3">
            <p className="text-sm text-gray-600">
              {/* or{' '} */}
              <button
                onClick={() => navigate('/signup')}
                className="font-medium underline text-sky-600 hover:text-sky-500"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-xs ml-28 mt-8">
        <img
          src={mailmanIllustration}
          alt="A stylized illustration of a mailman delivering a letter to a mailbox"
        />
      </div>
    </div>
  )
}

export default LoginPage
