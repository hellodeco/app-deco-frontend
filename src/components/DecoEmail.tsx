import React, { useState, Fragment } from 'react'
import type { User } from '../types/types'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
  GET_CURRENT_USER_NOTION_INTEGRATION,
} from '../graphql/queries'
import { SET_USERS_DECO_EMAIL } from '../graphql/mutations'
import { GET_USER_META } from '../graphql/queries'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import ReconnectNotionModal from './Modal'
import DatabaseSelect from './deco-email/DatabaseSelect'
import { Menu, Transition } from '@headlessui/react'
import PaymentBanner from './PaymentBanner'
import { ChooseDecoEmail } from './deco-email/ChooseDecoEmail'

function DecoEmail() {
  const { loading, data } = useQuery<{ currentUser: User }>(GET_USER_META)
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO)
  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION)

  const [handleSetEmail, { data: setEmailData }] = useMutation(
    SET_USERS_DECO_EMAIL,
    {
      refetchQueries: [{ query: GET_USER_META }],
    },
  )

  const notionIntegrationData =
    notionIntegration.data?.getCurrentUserNotionIntegration

  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo

  const userData = data?.currentUser
  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  const [openReconnectModal, setOpenReconnectModal] = useState(false)

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
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
          {!userData?.emailAddress && (
            <ChooseDecoEmail handleSetEmail={handleSetEmail} />
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
