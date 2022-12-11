import React from 'react'
import Userfront from '@userfront/core'
import mailmanIllustration from '../media/hellodeco-logo.png'
import HelloDecoFontLogo from '../media/hellodeco-logo-2.svg'
import { useNavigate } from 'react-router-dom'

function PasswordResetPage() {
  const [password, setPassword] = React.useState('')
  const [verifyPassword, setVerifyPassword] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  let navigate = useNavigate()

  const handlePasswordReset = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (password !== verifyPassword) {
      setErrorMessage("Passwords don't match")
      return
    }

    Userfront.resetPassword({
      password: password,
    })
      .then(() => {
        setSuccessMessage('Success! Logging you in')
      })
      .catch((err: any) => {
        setErrorMessage(
          'Uh-oh! We hit a snag. Try following the link from your email again',
        )
      })
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
                Reset password
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium underline text-indigo-600 hover:text-indigo-500"
                >
                  head back to login
                </button>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form action="#" method="POST" className="space-y-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
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

                  <div className="space-y-1">
                    <label
                      htmlFor="verifyPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Verify New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="verifyPassword"
                        name="verifyPassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        onChange={(event) =>
                          setVerifyPassword(event.target.value)
                        }
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-sm text-red-600" id="password-error">
                      {errorMessage}
                    </p>
                  )}

                  {successMessage && (
                    <p className="text-sm text-green-600" id="password-error">
                      {successMessage}
                    </p>
                  )}

                  <div>
                    <button
                      type="submit"
                      onClick={(event) => handlePasswordReset(event)}
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Reset password
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

export default PasswordResetPage
