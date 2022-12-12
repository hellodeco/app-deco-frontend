import React, { useState } from 'react'
import type { User } from '../types/types'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
  GET_CURRENT_USER_NOTION_INTEGRATION,
  EMAIL_DOMAIN,
  GET_EMAIL_AVAILABILITY,
} from '../graphql/queries'
import { SET_USERS_DECO_EMAIL } from '../graphql/mutations'
import { GET_USER_META } from '../graphql/queries'
import {
  ExclamationTriangleIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'
import ReconnectNotionModal from './Modal'
import DatabaseSelect from './deco-email/DatabaseSelect'

function DecoEmail() {
  const { loading, data } = useQuery<{ currentUser: User }>(GET_USER_META)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)
  const { data: emailDomainData } = useQuery(EMAIL_DOMAIN)
  const [
    getEmailAvailable,
    { loading: emailAvailableLoading, data: emailAvailableData },
  ] = useLazyQuery(GET_EMAIL_AVAILABILITY)

  const emailDomain = emailDomainData?.emailDomain

  const notionIntegrationData =
    notionIntegration.data?.getCurrentUserNotionIntegration

  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo

  const userData = data?.currentUser
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const [openReconnectModal, setOpenReconnectModal] = useState(false)

  const [newDecoEmailUsername, setNewDecoEmail] = useState('')
  const [timer, setTimer] = useState<any>()
  const [emailAvailable, setEmailAvailable] = useState(true)

  const isValidEmailUsername = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*$/
    return emailRegex.test(email)
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  const [handleSetEmail, { data: setEmailData }] = useMutation(
    SET_USERS_DECO_EMAIL,
    {
      refetchQueries: [{ query: GET_USER_META }],
    },
  )

  const handleSubmitSetDecoEmail = (e: any) => {
    e.preventDefault()

    handleSetEmail({
      variables: { username: newDecoEmailUsername },
    })

    setNewDecoEmail('')
  }

  const handleDecoEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const decoEmailUsername = e.target.value

    setNewDecoEmail(decoEmailUsername)

    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      getEmailAvailable({ variables: { username: newDecoEmailUsername } })

      if (
        decoEmailUsername.length > 3 &&
        emailAvailableData?.emailUsernameAvailable &&
        isValidEmailUsername(decoEmailUsername)
      ) {
        setEmailAvailable(true)
      } else {
        setEmailAvailable(false)
      }
    }, 500)

    setTimer(newTimer)
  }

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

  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-900 px-4 sm:p-6">
        Manage Notion Connection
      </h1>
      <div className="overflow-hidden rounded-lg bg-white shadow-lg max-w-4xl">
        {/* START UPGRADE BANNER CALLOUT */}
        {paywallEnabled && (
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon
                  className="h-5 w-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-yellow-700">
                  Heads up! You're still on our free plan. Our free plan limits
                  you to 100 emails in your Notion inbox.
                </p>
                <p className="mt-3 text-sm md:mt-0 md:ml-6">
                  <button
                    onClick={handleStripeBillingPortal}
                    className="whitespace-nowrap font-medium text-yellow-700 hover:text-yellow-600"
                  >
                    Upgrade
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
        {/* END UPGRADE BANNER CALLOUT */}

        <div className="px-4 py-5 sm:p-6">
          {/* START CHOOSE / DISPLAY DECO EMAIL */}
          {!userData?.emailAddress ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Select your Hellodeco email
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  This is the shiny new email address you'll use to send emails
                  to your Notion workspace. Once you decide, you can't change
                  it, so choose wisely!
                </p>
              </div>
              <form className="mt-5 sm:flex sm:items-center">
                <div className="w-1/2 mr-2 sm:max-w-xs">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="text"
                    name="decoEmail"
                    id="decoEmail"
                    value={newDecoEmailUsername}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    placeholder="name"
                    onChange={handleDecoEmailChange}
                  />
                </div>
                <p className="mr-4">@{emailDomain}</p>

                <button
                  type="submit"
                  className="disabled:bg-sky-300 mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={!emailAvailable}
                  onClick={(e) => handleSubmitSetDecoEmail(e)}
                >
                  Save
                </button>
              </form>
            </div>
          ) : (
            <></>
          )}
          {/* END CHOOSE / DISPLAY DECO EMAIL */}

          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Connected Notion account details
          </h3>

          <div className="ml-4 flex-shrink-0">
            <button className="font-medium text-indigo-600 hover:text-indigo-500">
              Download
            </button>
          </div>
          {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Changed your mind, and want to choose a new Notion workspace or
              Database?
            </p>

            <button
              type="button"
              className="max-w-[300px] items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              onClick={() => setOpenReconnectModal(true)}
            >
              {notionIntegrationData
                ? 'Connect a different Notion workspace'
                : 'Connect your Notion workspace'}
            </button> */}
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Hellodeco Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {userData && userData.emailAddress ? (
                  <a
                    href={userData ? `mailto:${userData.emailAddress}` : '#'}
                    className="underline"
                  >
                    {userData.emailAddress}
                  </a>
                ) : (
                  <p className="text-sm text-red-600">
                    Please choose your Hellodeco email address!
                  </p>
                )}
              </dd>
            </div>
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
              {notionIntegrationData && (
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {notionIntegrationData.workspaceIcon}{' '}
                  {notionIntegrationData.workspaceName}
                </dd>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Workspace owner email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {notionIntegrationData && notionIntegrationData.email}
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
                  notionIntegrationData && (
                    <DatabaseSelect
                      notionIntegration={notionIntegration}
                      notionDatabase={notionDatabase}
                    />
                  )
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <ReconnectNotionModal
        open={openReconnectModal}
        setOpen={() => setOpenReconnectModal(false)}
        isReconnect={!!notionIntegrationData}
      />
    </>
  )
}

export default DecoEmail
