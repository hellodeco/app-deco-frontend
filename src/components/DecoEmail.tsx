import React, { useState } from 'react'
import type { User } from '../types/types'
import { useQuery } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
  GET_CURRENT_USER_NOTION_INTEGRATION,
} from '../graphql/queries'
import { GET_USER_META } from '../graphql/queries'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import ReconnectNotionModal from './Modal'

function DecoEmail() {
  const { loading, data } = useQuery<{ currentUser: User }>(GET_USER_META)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)

  const notionIntegrationData =
    notionIntegration.data?.getCurrentUserNotionIntegration

  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo

  const userData = data?.currentUser
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const [openReconnectModal, setOpenReconnectModal] = useState(false)

  const handleStripeBillingPortal = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userfrontUserId: userData?.userfrontID,
        email: userData?.signupEmail,
      }),
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/stripe/checkout-session`,
      payload,
    )

    if (response.status !== 200) {
      console.log('Error opening Stripe billing portal')
      return
    }

    const resBody = await response.json()
    window.location = resBody.sessionUrl
  }

  if (loading || notionDatabase.loading || notionIntegration.loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Loading...</h1>
      </div>
    )
  }
  console.log(notionDatabaseData)
  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-900 px-4 sm:p-6">
        Manage Notion Connection
      </h1>
      <div className="overflow-hidden rounded-lg bg-white shadow-xl">
        {paywallEnabled && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon
                  className="h-5 w-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Heads up! You're still on our free plan.
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Our free plan limits you to 100 emails in your Notion inbox.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      className="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
                      onClick={handleStripeBillingPortal}
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="px-4 py-5 sm:p-6">
          {/* <ManageDecoEmail userData={userData} />

          <NotionInitiateAuth
            userData={userData}
            notionDatabase={notionDatabase}
            notionIntegration={notionIntegration}
          />
          <NotionSelectDatabase
            userData={userData}
            notionDatabase={notionDatabase}
            notionIntegration={notionIntegration}
          />
          <NotionSuccessOrFormat
            userData={userData}
            notionDatabase={notionDatabase}
            notionIntegration={notionIntegration}
          /> */}

          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Connected Notion account
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your deco email address and the connected Notion database
            you're using for your Notion inbox.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Connection status
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {notionDatabaseData ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                    <svg
                      className="-ml-1 mr-1.5 h-2 w-2 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                    <svg
                      className="-ml-1 mr-1.5 h-2 w-2 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Disconnected
                  </span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Workspace name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {notionIntegrationData.workspaceIcon}{' '}
                {notionIntegrationData.workspaceName}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Workspace owner email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {notionIntegrationData.email}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Database name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {notionDatabaseData ? (
                  <a
                    href={notionDatabaseData.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {notionDatabaseData.icon} {notionDatabaseData.title}
                  </a>
                ) : (
                  <p className="text-sm text-red-600">Database not selected!</p>
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <button
                type="button"
                className="max-w-[260px] items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setOpenReconnectModal(true)}
              >
                Connect a different Notion page
              </button>
            </div>
          </dl>
        </div>
      </div>
      <ReconnectNotionModal
        open={openReconnectModal}
        setOpen={() => setOpenReconnectModal(false)}
      />
    </>
  )
}

export default DecoEmail
