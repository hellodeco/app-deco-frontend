import {
  Flex,
  Heading,
  Divider,
  Button,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  Text,
  Link,
  Stack,
} from '@chakra-ui/react'
import Userfront from '@userfront/core'
import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import type { User } from '../types/types'
import { GET_USER_META } from '../graphql/queries'

function Help() {
  const { loading, data } = useQuery<{ currentUser: User }>(GET_USER_META)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [validateNewPassword, setValidateNewPassword] = useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

  const userData = data?.currentUser

  if (loading) {
    return <Flex>Loading...</Flex>
  }

  const handleStripeBillingPortal = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    let stripeURL
    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userfrontUserId: userData?.userfrontID,
        email: userData?.signupEmail,
      }),
    }

    if (paywallEnabled) {
      stripeURL = '/stripe/checkout-session'
    } else {
      stripeURL = '/stripe/billing-portal'
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}${stripeURL}`,
      payload,
    )

    if (response.status !== 200) {
      console.log('Error opening Stripe billing portal')
      return
    }

    const resBody = await response.json()
    window.location = resBody.sessionUrl
  }

  const handlePasswordReset = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    if (newPassword !== validateNewPassword) {
      setErrorMessage("Passwords don't match")
      return
    }

    try {
      await Userfront.user.updatePassword({
        password: newPassword,
        existingPassword: oldPassword,
        method: 'jwt',
      })

      setOldPassword('')
      setNewPassword('')
      setValidateNewPassword('')
      setSuccessMessage('Password has been reset')
    } catch (err) {
      // handle err
      console.log(typeof err, err)
      setErrorMessage('Please ensure your old password is correct')
    }
  }

  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  return (
    <Flex flexDirection="column" w="100%" mx="20px" mb="40px">
      <Heading size="xl">Help + Support</Heading>
      <Divider my="30px" />
      <Heading size="md" mb="20px">
        Have questions or feedback?
      </Heading>

      <Text size="md" mb="20px">
        For starters, you can check out our FAQ doc that walks you through how
        it works:{' '}
        <Link
          href="https://hellodeco.so/how-it-works"
          textDecoration={'underline'}
          target="_blank"
        >
          read the doc
        </Link>
        .
      </Text>

      <Text size="md" mb="20px">
        If you need to reach out, we'd love to hear from you, whether you're
        having trouble getting started, found a bug, or have a feature request.
        We do our best to respond within the same day, and ideally within the
        same hour.
      </Text>

      <Text size="md" mb="20px">
        Email us with any questions or feedback at:{' '}
        <Link
          textDecoration={'underline'}
          href="mailto:help@hellodeco.so"
          target="_blank"
        >
          help@hellodeco.so
        </Link>
      </Text>
      <Text size="md" mb="20px">
        Reach out to us on Twitter by tweeting at us or sending us a DM! You can
        find us{' '}
        <Link
          textDecoration={'underline'}
          href="https://mobile.twitter.com/hellodecoapp"
          target="_blank"
        >
          @hellodecoapp
        </Link>
        .
      </Text>
    </Flex>
  )
}

export default Help
