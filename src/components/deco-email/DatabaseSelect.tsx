import { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CONNECTED_NOTION_PAGES } from '../../graphql/queries'
import { SELECT_NOTION_DATABASE } from '../../graphql/mutations'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface NotionPage {
  id: string
  title: string
  url: string
  icon: {
    type: string
    emoji: string
    url: string
  }
}

interface NotionAuthProps {
  notionIntegration: any
  notionDatabase: any
  setOpenReconnectModal: (e: boolean) => void
}

export default function DatabaseSelect(props: NotionAuthProps) {
  const { notionIntegration, notionDatabase, setOpenReconnectModal } = props
  const [selected, setSelected] = useState<NotionPage>({
    id: '0',
    title: 'Choose your database',
    url: '#',
    icon: {
      type: '#',
      emoji: '#',
      url: '#',
    },
  })

  const [getConnectedNotionPages, { data, loading }] = useLazyQuery(
    CONNECTED_NOTION_PAGES,
    {
      fetchPolicy: 'cache-and-network',
    },
  )

  useEffect(() => {
    getConnectedNotionPages()
  }, [notionIntegration, getConnectedNotionPages])

  const [selectNotionDatabase] = useMutation(SELECT_NOTION_DATABASE)

  const setSelectedDatabase = async (notionPage: any) => {
    setSelected(notionPage)
    await selectNotionDatabase({
      variables: {
        databaseId: notionPage.id,
      },
    })
    await notionDatabase.refetch()
  }

  return (
    <div className="pb-6 mb-6 border-b border-gray-200">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Choose your Notion Database
      </h3>
      <div className="flex justify-between w-full">
        <div className="my-2 max-w-xl text-sm text-gray-900">
          <p>
            Use the dropdown to select the database you want your emails
            delivered to. Note that only Notion databases are eligible for use
            as an inbox, so only databases will show up in the dropdown list.
          </p>
        </div>
        <Listbox value={selected} onChange={setSelectedDatabase}>
          {({ open }) => (
            <>
              <div className="relative mt-1 max-w-xs">
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm">
                  <span className="block truncate">{selected.title}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {data && data.connectedNotionPages ? (
                      data.connectedNotionPages.map(
                        (notionPage: NotionPage) => (
                          <Listbox.Option
                            key={notionPage.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? 'text-white bg-sky-600'
                                  : 'text-gray-900',
                                'relative cursor-default select-none py-2 pl-3 pr-9',
                              )
                            }
                            value={notionPage}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? 'font-semibold' : 'font-normal',
                                    'block truncate',
                                  )}
                                >
                                  {notionPage.title}
                                </span>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? 'text-white' : 'text-sky-600',
                                      'absolute inset-y-0 right-0 flex items-center pr-4',
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ),
                      )
                    ) : (
                      <></>
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
      </div>
      <div className="flex justify-between w-full">
        <div className="my-2 max-w-xl text-sm text-gray-900">
          <p>
            Changed your mind about what database you want to use? No worries,
            just go through the Notion authorization again.
          </p>
        </div>
        <button
          type="submit"
          className="disabled:bg-sky-300 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-sky-600 px-4 font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={() => setOpenReconnectModal(true)}
        >
          Reconnect Notion
        </button>
      </div>
    </div>
  )
}
