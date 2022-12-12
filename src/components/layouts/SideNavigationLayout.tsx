import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import Userfront from '@userfront/core'
import {
  Bars3Icon,
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import HelloDecoFontLogo from '../../media/hellodeco-logo-2.svg'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface SideNavigationLayoutProps {
  children: React.ReactNode
}

function SideNavigationLayout({ children }: SideNavigationLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  let location = useLocation()
  let navigate = useNavigate()

  const navigation = [
    {
      name: 'Email',
      href: '/email',
      icon: HomeIcon,
      current: location.pathname === '/email' ? true : false,
    },
    {
      name: 'Account',
      href: '/account',
      icon: UsersIcon,
      current: location.pathname === '/account' ? true : false,
    },
    {
      name: 'Help + Support',
      href: '/help',
      icon: FolderIcon,
      current: location.pathname === '/help' ? true : false,
    },
  ]

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-sky-700">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=sky&shade=300"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="mt-5 space-y-1 px-2">
                      {navigation.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => navigate(item.href)}
                          className={classNames(
                            item.current
                              ? 'bg-sky-800 text-white'
                              : 'text-white hover:bg-sky-600 hover:bg-opacity-75',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md',
                          )}
                        >
                          <item.icon
                            className="mr-4 h-6 w-6 flex-shrink-0 text-sky-300"
                            aria-hidden="true"
                          />
                          {item.name}
                        </button>
                      ))}
                      <button
                        className={classNames(
                          'text-white hover:bg-sky-600 hover:bg-opacity-75 w-full',
                          'group flex items-center px-2 py-2 text-base font-medium rounded-md',
                        )}
                        onClick={() => Userfront.logout()}
                      >
                        <CalendarIcon
                          className="mr-4 h-6 w-6 flex-shrink-0 text-sky-300"
                          aria-hidden="true"
                        />
                        Logout
                      </button>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-white ml-6 mt-2">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <img
                  className="h-8 w-auto"
                  src={HelloDecoFontLogo}
                  alt="HelloDeco company logo"
                />
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={classNames(
                      item.current
                        ? 'bg-sky-800 text-white w-full'
                        : 'text-gray-900 w-full hover:bg-sky-700 hover:text-white hover:bg-opacity-75',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    )}
                  >
                    <item.icon
                      className="mr-3 h-6 w-6 flex-shrink-0 text-sky-400"
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                ))}
                <button
                  className="text-gray-900 hover:bg-sky-700 hover:text-white hover:bg-opacity-75 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  onClick={() => Userfront.logout()}
                >
                  <CalendarIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-sky-400"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-16 pb-8 sm:px-6 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default SideNavigationLayout
