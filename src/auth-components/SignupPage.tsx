import React from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_NEW_USER } from '../graphql/mutations'
import Userfront from '@userfront/core'
import { Navigate, useNavigate } from 'react-router-dom'
import mailmanIllustration from '../media/hellodeco-logo.png'
import HelloDecoFontLogo from '../media/hellodeco-logo-2.svg'

function getEmailParam() {
  let params = new URLSearchParams(window.location.search)
  return params.get('email') || ''
}

const SignupPage = () => {
  const [email, setEmail] = React.useState(getEmailParam())
  const [password, setPassword] = React.useState('')
  const [passwordVerify, setPasswordVerify] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')

  let navigate = useNavigate()

  const [handleCreateUser, { data, loading, error }] = useMutation(
    CREATE_NEW_USER,
    {
      onCompleted: (data) => {
        const { success, errorMessage } = data.createUserfrontAndDecoUser

        if (success) {
          Userfront.login({
            method: 'password',
            email: email,
            password: password,
          }).catch((error: any) => {
            setErrorMessage(error.message)
          })
        }

        if (errorMessage) {
          setErrorMessage(data.createUserfrontAndDecoUser.errorMessage)
        }
      },
    },
  )

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters')
    } else if (password !== passwordVerify) {
      setErrorMessage('Oops! Please make sure your passwords match')
    } else {
      setErrorMessage('')

      await handleCreateUser({
        variables: { email: email, password: password },
      })
    }
  }

  if (Userfront.accessToken()) {
    return <Navigate to={'/account'} />
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
                Sign up for a new account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium underline text-sky-600 hover:text-sky-500"
                >
                  login to an existing account
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

                  <div className="space-y-1">
                    <label
                      htmlFor="verifyPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Verify Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="verifyPassword"
                        name="verifyPassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        onChange={(event) =>
                          setPasswordVerify(event.target.value)
                        }
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
                      onClick={(event) => handleSignup(event)}
                      className="flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
          <img
            src={mailmanIllustration}
            alt="A stylized illustration of a mailman delivering a letter to a mailbox"
          />
        </div>
      </div>
    </div>
  )
}

export default SignupPage
