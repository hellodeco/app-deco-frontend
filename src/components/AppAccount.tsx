import Userfront from '@userfront/core'
import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import type { User } from '../types/types'
import { GET_USER_META } from '../graphql/queries'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import PaymentBanner from './PaymentBanner'

function AppAccount() {
  const { loading, data } = useQuery<{ currentUser: User }>(GET_USER_META)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [validateNewPassword, setValidateNewPassword] = useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  const userData = data?.currentUser

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
      </div>
    )
  }

  const handleStripeBillingPortal = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    let stripeURL
    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userfrontUserId: userData?.userfrontID,
        email: userData?.signupEmail,
      }),
    }

    if (paywallEnabled) {
      stripeURL = '/stripe/checkout-session'
    } else {
      stripeURL = '/stripe/billing-portal'
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}${stripeURL}`,
      payload,
    )

    if (response.status !== 200) {
      console.log('Error opening Stripe billing portal')
      return
    }

    const resBody = await response.json()
    window.location = resBody.sessionUrl
  }

  const handlePasswordReset = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (newPassword !== validateNewPassword) {
      setErrorMessage("Uh oh! Those passwords don't match!")
      return
    }

    try {
      await Userfront.user.updatePassword({
        password: newPassword,
        existingPassword: oldPassword,
        method: 'jwt',
      })

      setOldPassword('')
      setNewPassword('')
      setValidateNewPassword('')
      setSuccessMessage('Password has been reset')
    } catch (err) {
      // handle err
      console.log(typeof err, err)
      setErrorMessage('Please ensure your old password is correct')
    }
  }

  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-900 px-4 sm:p-6">
        Account Details
      </h1>
      <div className="overflow-hidden rounded-lg bg-white shadow-lg max-w-4xl">
        {paywallEnabled && <PaymentBanner userData={userData} />}
        <div className="px-4 py-5 sm:p-6">
          <h2 className="pb-4 text-2xl font-semibold text-gray-900">
            Signup Information
          </h2>
          <p>Your signup email: {userData?.signupEmail}</p>

          <div className="my-8 w-full border-t border-gray-300"></div>

          <h2 className="pb-2 text-2xl font-semibold text-gray-900">
            Manage Billing
          </h2>

          <p className="py-2">
            {paywallEnabled
              ? "Don't want to worry about email limits? Upgrade to get unlimited delivery!"
              : 'Visit the Stripe dashboard using the button below to manage your subscription.'}
          </p>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            onClick={handleStripeBillingPortal}
          >
            {paywallEnabled ? 'Upgrade to Pro' : 'Go to billing'}
          </button>

          <div className="my-8 w-full border-t border-gray-300"></div>

          <h2 className="text-2xl font-semibold text-gray-900">
            Reset Password
          </h2>

          <div className="w-1/2">
            <div className="my-6">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Old Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="Old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="my-6">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="my-6">
              <label
                htmlFor="verifyPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Verify Password
              </label>
              <div className="relative mt-1">
                <input
                  type="password"
                  name="verifyPassword"
                  id="verifyPassword"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="Verify new password"
                  value={validateNewPassword}
                  onChange={(e) => setValidateNewPassword(e.target.value)}
                />
                {errorMessage && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {errorMessage}
                </p>
              )}
              {successMessage && (
                <p
                  className="mt-2 text-sm text-green-600"
                  id="password-success"
                >
                  {successMessage}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            onClick={handlePasswordReset}
          >
            Reset password
          </button>
        </div>
      </div>
    </>
  )
}

export default AppAccount
