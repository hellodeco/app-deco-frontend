import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { User } from '../types/types'

export default function PaymentBanner(props: { userData: User }) {
  const { userData } = props

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

  return (
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
            Heads up! You're still on our free plan. Our free plan limits you to
            100 emails in your Notion inbox.
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
  )
}
