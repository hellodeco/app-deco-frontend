const Help = () => {
  return (
    <>
      <h1 className="text-3xl font-semibold text-gray-900 px-4 sm:p-6">
        Help + Support
      </h1>
      <div className="overflow-hidden rounded-lg bg-white shadow-lg max-w-4xl">
        <div className="px-4 pt-5 mb-4 sm:p-6">
          <h2 className="pb-4 text-2xl font-semibold text-gray-900">
            Documentation
          </h2>
          <p>
            For FAQ and a video walkthrough of the product,{' '}
            <a
              href="https://hellodeco.so/how-it-works"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              check out our FAQ doc here
            </a>
            .
          </p>

          <div className="my-8 w-full border-t border-gray-300"></div>

          <h2 className="pb-4 text-2xl font-semibold text-gray-900">
            Contact Us
          </h2>

          <p>
            Found a bug? Have a feature request? Just want to chat? We'd love to
            hear from you!
          </p>
          <p>
            We do our best to respond within the same day, and ideally within
            the same hour.
          </p>

          <p className="mt-4">
            Email us with any questions or feedback at:{' '}
            <a
              className="underline"
              href="mailto:help@hellodeco.so"
              target="_blank"
              rel="noreferrer"
            >
              help@hellodeco.so
            </a>
          </p>

          <p>
            Reach out to us on Twitter by tweeting at us or sending us a DM! You
            can find us{' '}
            <a
              className="underline"
              href="https://mobile.twitter.com/hellodecoapp"
              target="_blank"
              rel="noreferrer"
            >
              @hellodecoapp
            </a>
            .
          </p>
        </div>
      </div>
    </>
  )
}

export default Help
