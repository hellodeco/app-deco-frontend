import React, { useState, Fragment, useEffect } from 'react'
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
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import ReconnectNotionModal from './Modal'
import DatabaseSelect from './deco-email/DatabaseSelect'
import { Menu, Transition } from '@headlessui/react'
import PaymentBanner from './PaymentBanner'

function DecoEmail() {
  const { loading, data } = useQuery<{ currentUser: User }>(GET_USER_META)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)
  const { data: emailDomainData } = useQuery(EMAIL_DOMAIN)
  const [
    getEmailAvailable,
    { loading: emailAvailableLoading, data: emailAvailableData },
  ] = useLazyQuery(GET_EMAIL_AVAILABILITY)

  useEffect(() => {
    getEmailAvailable({ variables: { username: newDecoEmailUsername } })
  }, [])

  const emailDomain = emailDomainData?.emailDomain

  const notionIntegrationData =
    notionIntegration.data?.getCurrentUserNotionIntegration

  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo

  const userData = data?.currentUser
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const [openReconnectModal, setOpenReconnectModal] = useState(false)

  const [newDecoEmailUsername, setNewDecoEmail] = useState('')
  const [emailAvailableError, setEmailAvailableError] = useState('')

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

  const handleSubmitSetDecoEmail = async (e: any) => {
    e.preventDefault()

    if (newDecoEmailUsername.length < 3) {
      setEmailAvailableError('Email must be longer than 3 characters')
      return
    }

    if (!isValidEmailUsername(newDecoEmailUsername)) {
      setEmailAvailableError('Email cannot contain special characters')
      return
    }

    await getEmailAvailable({ variables: { username: newDecoEmailUsername } })

    if (emailAvailableData?.emailUsernameAvailable) {
      handleSetEmail({
        variables: { username: newDecoEmailUsername },
      })

      setNewDecoEmail('')

      return
    } else {
      setEmailAvailableError('Email is already taken')
      return
    }
  }

  const handleDecoEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const decoEmailUsername = e.target.value
    setEmailAvailableError('')

    setNewDecoEmail(decoEmailUsername)
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
      <div className="rounded-lg bg-white shadow-lg max-w-4xl">
        {/* START UPGRADE BANNER CALLOUT */}
        {paywallEnabled && <PaymentBanner userData={userData} />}
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
                  onClick={(e) => handleSubmitSetDecoEmail(e)}
                >
                  Save
                </button>
              </form>
              {emailAvailableError && (
                <p className="text-sm text-red-600" id="password-error">
                  {emailAvailableError}
                </p>
              )}
            </div>
          ) : (
            <></>
          )}
          {/* END CHOOSE / DISPLAY DECO EMAIL */}

          <div className="sm:flex sm:items-baseline sm:justify-between">
            <div className="sm:w-0 sm:flex-1">
              <h1
                id="message-heading"
                className="text-lg font-medium text-gray-900"
              >
                Notion details
              </h1>
              <p className="mt-1 truncate text-sm text-gray-500">
                View details about your Hellodeco email, and your connected
                Notion inbox.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
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
              <Menu as="div" className="relative ml-3 inline-block text-left">
                <div>
                  <Menu.Button className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="button"
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'flex w-full justify-between px-4 py-2 text-sm',
                            )}
                            onClick={() => setOpenReconnectModal(true)}
                          >
                            <span>Connect new workspace</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Hellodeco email
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
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Workspace name
              </dt>
              {notionIntegrationData && (
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-b-lg">
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
