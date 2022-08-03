import React, { useState } from 'react'
import {
  Flex,
  Heading,
  Divider,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Tag,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import type { User } from '../../types/types'
import { useQuery, useMutation } from '@apollo/client'
import {
  EMAIL_DOMAIN,
  GET_EMAIL_AVAILABILITY,
  GET_USER_META,
} from '../../graphql/queries'
import { SET_USERS_DECO_EMAIL } from '../../graphql/mutations'

interface IProps {
  userData: User
}

function getSetEmailErrorText(errorReason: string) {
  switch (errorReason) {
    case 'ALREADY_TAKEN':
      return 'Email address is already in use by another user'
    case 'CANNOT_CHANGE_EMAIL':
      return "Sorry, you've already chosen an email and unfortunately, you can't change it"
    case 'INVALID_FORMAT':
      // we should be specific here
      return 'Format invalid, please try again'
    case 'NO_SUBSCRIPTION':
      return 'You need a valid subscription to set an email'
    case 'NOT_ENOUGH_CHARS':
      return 'Email username must be at least 3 characters long'
    default:
      return "Sorry, we hit a snag while trying to create you're email address"
  }
}

function AddNewEmailForm(props: IProps) {
  const { userData } = props
  const [newDecoEmailUsername, setNewDecoEmail] = useState('')
  const [emailValid, setEmailValid] = useState(true)
  const [emailAvailable, setEmailAvailable] = useState(true)
  const [showCreateButton, setShowCreateButton] = useState(false)
  // TODO add error handling for failed query or mutation
  const [showError, setShowError] = useState(false)

  const isValidEmailUsername = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const decoEmailUsername = e.target.value
    setNewDecoEmail(decoEmailUsername)
    setShowCreateButton(false)

    setEmailValid(isValidEmailUsername(decoEmailUsername))
  }

  const { data: emailDomainData } = useQuery(EMAIL_DOMAIN)
  const emailDomain = emailDomainData?.emailDomain

  const { data } = useQuery(GET_EMAIL_AVAILABILITY, {
    variables: { username: newDecoEmailUsername },
  })

  const checkEmailAvailability = async () => {
    if (data?.emailUsernameAvailable) {
      setEmailAvailable(true)
      setShowCreateButton(true)
    } else {
      setEmailAvailable(false)
      setShowCreateButton(false)
    }
  }

  const [handleSetEmail, { data: setEmailData }] = useMutation(
    SET_USERS_DECO_EMAIL,
    {
      refetchQueries: [{ query: GET_USER_META }],
    },
  )

  // TODO: display this to the user
  if (setEmailData && !setEmailData.success) {
    const errorReason = getSetEmailErrorText(setEmailData.errorReason)
    console.log(errorReason)
  }

  const paywallEnabled = userData?.subscriptionStatus !== 'active'

  return (
    <>
      {paywallEnabled ? (
        <Alert status="error" mt="30px">
          <AlertTitle>No subscription found!</AlertTitle>
          <AlertDescription>
            Head over to the Account page to get started.
          </AlertDescription>
        </Alert>
      ) : (
        <Heading size="md" mt="20px">
          "Let's get your Deco email address set up"
        </Heading>
      )}

      <>
        {emailDomain && (
          <FormControl mt="30px" isInvalid={!emailValid || !emailAvailable}>
            <FormLabel htmlFor="email">
              Claim an email address. Once you choose, you can't change it, so
              choose wisely!
            </FormLabel>
            <Flex flexDir="row" alignItems="center">
              <Input
                w="450px"
                size="lg"
                id="email"
                type="email"
                value={newDecoEmailUsername}
                onChange={handleChange}
                placeholder="name"
                disabled={paywallEnabled}
              />
              <Text color="gray.dark" pl="13px">
                @{emailDomain}
              </Text>
            </Flex>
            {!emailValid && (
              <FormErrorMessage>Email address is invalid</FormErrorMessage>
            )}
            {!emailAvailable && (
              <FormErrorMessage>Email address already taken</FormErrorMessage>
            )}
          </FormControl>
        )}

        {showCreateButton ? (
          <>
            <Tag
              mt="15px"
              width="-webkit-fit-content"
              size="lg"
              variant="solid"
              colorScheme="green"
            >
              That email address is available!
            </Tag>
            <Button
              w="300px"
              my="20px"
              onClick={() =>
                handleSetEmail({
                  variables: { username: newDecoEmailUsername },
                })
              }
              disabled={!emailValid || paywallEnabled}
            >
              Create Deco Email
            </Button>
          </>
        ) : (
          <Button
            w="300px"
            my="20px"
            onClick={checkEmailAvailability}
            disabled={!emailValid || paywallEnabled}
          >
            Check Availability
          </Button>
        )}
      </>
    </>
  )
}

export function ManageDecoEmail(props: IProps) {
  const { userData } = props

  return (
    <>
      <Heading size="xl">Your Deco Email Address</Heading>

      {!userData?.emailAddress ? (
        <AddNewEmailForm userData={userData} />
      ) : (
        <>
          <Heading size="md" mt="20px">
            Your Deco email address is:
          </Heading>

          <Tag
            mt="15px"
            width="-webkit-fit-content"
            size="lg"
            variant="solid"
            colorScheme="gray"
          >
            {userData.emailAddress}
          </Tag>
        </>
      )}

      <Divider my="30px" />
    </>
  )
}
