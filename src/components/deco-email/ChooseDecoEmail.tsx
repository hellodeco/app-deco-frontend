import { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { EMAIL_DOMAIN, GET_EMAIL_AVAILABILITY } from '../../graphql/queries'

export const ChooseDecoEmail = (props: { handleSetEmail: any }) => {
  const { handleSetEmail } = props
  const { data: emailDomainData } = useQuery(EMAIL_DOMAIN)
  const emailDomain = emailDomainData?.emailDomain
  const [newDecoEmailUsername, setNewDecoEmail] = useState('')
  const [emailAvailableError, setEmailAvailableError] = useState('')

  const isValidEmailUsername = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*$/
    return emailRegex.test(email)
  }

  const [
    getEmailAvailable,
    { loading: emailAvailableLoading, data: emailAvailableData },
  ] = useLazyQuery(GET_EMAIL_AVAILABILITY)

  useEffect(() => {
    getEmailAvailable({ variables: { username: newDecoEmailUsername } })
  }, [])

  const handleDecoEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const decoEmailUsername = e.target.value
    setEmailAvailableError('')

    setNewDecoEmail(decoEmailUsername)
  }

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

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Select your Hellodeco email
      </h3>
      <div className="mt-2 max-w-xl text-sm text-gray-500">
        <p>
          This is the shiny new email address you'll use to send emails to your
          Notion workspace. Once you decide, you can't change it, so choose
          wisely!
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
  )
}
