import React from 'react'
import { useQuery } from '../../hooks/useQuery'
import HelloDecoFontLogo from '../../media/hellodeco-logo-2.svg'
import { useNavigate } from 'react-router-dom'
import mailmanIllustration from '../../media/hellodeco-logo.png'

export const NotionAuthFail = () => {
  const params = useQuery()

  let navigate = useNavigate()

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
              <h2 className="mt-6 text-lg font-bold tracking-tight text-gray-900">
                Uh-Oh! We were unable to connect your Notion workspace!
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Here's the error message we got:
              </p>

              <p className="mt-2 text-sm text-red-600" id="password-error">
                Error: {params.get('message')}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Successfully connected to Notion!
              </p>

              <p className="mt-4 text-sm text-gray-600">
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium underline text-sky-600 hover:text-sky-500"
                >
                  Head back to login
                </button>
              </p>
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
