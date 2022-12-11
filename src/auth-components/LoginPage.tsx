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
    <div className="flex max-w-7xl mx-auto">
      <div className="flex min-h-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                className="h-12 w-auto"
                src={HelloDecoFontLogo}
                alt="Your Company"
              />
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="font-medium underline text-indigo-600 hover:text-indigo-500"
                >
                  sign up for a new account
                </button>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form action="#" method="POST" className="space-y-6">
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
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-sm text-red-600" id="password-error">
                      {errorMessage}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <button
                        onClick={() => navigate('/forgot-password')}
                        className="font-medium underline text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      onClick={(event) => handleLogin(event)}
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 h-1/2 w-1/2 my-auto">
          <img className="" src={mailmanIllustration} alt="" />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
