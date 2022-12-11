import React, { useEffect } from 'react'
import HelloDecoFontLogo from '../../media/hellodeco-logo-2.svg'
import { useNavigate } from 'react-router-dom'
import mailmanIllustration from '../../media/hellodeco-logo.png'

export const NotionAuthSuccess = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close()
    }, 2000)
  }, [])

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
                Successfully connected to Notion!
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                You can go ahead and close this tab, or wait for it to
                auto-close.
              </p>

              <p className="mt-4 text-sm text-gray-600">
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium underline text-indigo-600 hover:text-indigo-500"
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
