import React from 'react'
import HelloDecoFontLogo from '../media/hellodeco-logo-2.svg'
import { useNavigate } from 'react-router-dom'
import mailmanIllustration from '../media/hellodeco-logo.png'

const PostCheckout = () => {
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
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
                Congratulations!
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Check your email - we're setting up your account now, and we've
                emailed you a magic link to get you logged in.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Once you're logged in, you can get started by choosing your
                @deco.so email address and connecting your Notion account.
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

export default PostCheckout
