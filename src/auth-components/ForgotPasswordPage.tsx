import React from 'react'
import mailmanIllustration from '../media/hellodeco-logo.png'
import HelloDecoFontLogo from '../media/hellodeco-logo-2.svg'
import { useNavigate } from 'react-router-dom'

import Userfront from '@userfront/core'

const ForgotPasswordPage = () => {
  const [email, setEmail] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  let navigate = useNavigate()

  const handleEmailFormChange = (e: any) => {
    setErrorMessage('')
    setSuccessMessage('')
    setEmail(e.target.value)
  }

  const handleResetPassword = (event: React.FormEvent) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setEmail('')

    if (!email) {
      setErrorMessage('Please enter a valid email')
      return
    }

    Userfront.sendResetLink(email)
      .then(({ result }: { result: { url: string } }) => {
        // this will exist when in test mode (e.g. local development)
        if (result?.url) {
          console.log(result.url)
        }
        setSuccessMessage('Success! Please check your email!')
      })
      .catch((error: any) => {
        setErrorMessage(error.message)
        return
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
                Reset Password
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

            <p className="mt-6 text-sm text-gray-600">
              Enter the email associated with your account. We'll email you a
              link to reset your password!
            </p>

            <div className="mt-4">
              <div>
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
                        onChange={handleEmailFormChange}
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
                      onClick={(event) => handleResetPassword(event)}
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Email reset link
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

export default ForgotPasswordPage
