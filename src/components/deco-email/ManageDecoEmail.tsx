import React, { useState } from 'react'
import {
  Flex,
  Heading,
  Divider,
  Button,
  Input,
  Image,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Link,
  Tag,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import type { User } from '../../types/types'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import {
  EMAIL_DOMAIN,
  GET_EMAIL_AVAILABILITY,
  GET_USER_META,
} from '../../graphql/queries'
import { SET_USERS_DECO_EMAIL } from '../../graphql/mutations'
import positiveNews from '../../media/positive-news.png'
import bigLetterInbox from '../../media/big-letter-inbox.png'

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
  const [emailAvailable, setEmailAvailable] = useState(true)
  const [timer, setTimer] = useState<any>()
  // TODO add error handling for failed query or mutation
  const [showError, setShowError] = useState(false)

  const isValidEmailUsername = (email: string) => {
    const emailRegex = /^\w+([\.-]?\w+)*$/
    return emailRegex.test(email)
  }

  const [getEmailAvailable, { loading, data }] = useLazyQuery(
    GET_EMAIL_AVAILABILITY,
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const decoEmailUsername = e.target.value

    setNewDecoEmail(decoEmailUsername)

    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      getEmailAvailable({ variables: { username: newDecoEmailUsername } })

      if (
        decoEmailUsername.length > 3 &&
        data?.emailUsernameAvailable &&
        isValidEmailUsername(decoEmailUsername)
      ) {
        setEmailAvailable(true)
      } else {
        setEmailAvailable(false)
      }
    }, 500)

    setTimer(newTimer)
  }

  const { data: emailDomainData } = useQuery(EMAIL_DOMAIN)
  const emailDomain = emailDomainData?.emailDomain

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
      <Heading size="lg" mt="20px">
        Step One - pick your email address
      </Heading>
      <Flex my="20px">
        <Image
          maxWidth={'200px'}
          src={positiveNews}
          alt="An excited woman holds a large envelope tucked under one arm"
        />
        <Text alignSelf={'center'}>
          This is the shiny new email address you'll use to send emails to your
          Notion workspace. Once you decide, you can't change it, so choose
          wisely!
        </Text>
      </Flex>
      {emailDomain && (
        <FormControl mt="30px" isInvalid={!emailAvailable}>
          <FormLabel htmlFor="email">Choose your email address</FormLabel>
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
          {!emailAvailable && (
            <FormErrorMessage>Email address is not available</FormErrorMessage>
          )}
        </FormControl>
      )}
      {emailAvailable && newDecoEmailUsername !== '' && (
        <Alert status="success" mt="20px" w="450px">
          <AlertIcon />
          That email is available!
        </Alert>
      )}
      <Button
        w="450px"
        my="20px"
        onClick={() =>
          handleSetEmail({
            variables: { username: newDecoEmailUsername },
          })
        }
        disabled={!emailAvailable || paywallEnabled}
        color={'white'}
        backgroundColor="blue.light"
        border={'1px solid blue.dark'}
        _hover={{ backgroundColor: 'blue.dark' }}
      >
        Create Deco Email
      </Button>
    </>
  )
}

export function ManageDecoEmail(props: IProps) {
  const { userData } = props

  return (
    <>
      {!userData?.emailAddress ? (
        <AddNewEmailForm userData={userData} />
      ) : (
        <>
          <Flex my="20px">
            <Image
              maxWidth={'200px'}
              src={bigLetterInbox}
              alt="A man holding a very large envelope"
            />
            <Flex direction={'column'} justifyContent="center">
              <Tag
                py="5px"
                color="white"
                backgroundColor={'blue.light'}
                justifyContent="center"
              >
                <Link
                  textAlign="center"
                  fontSize={'md'}
                  href={`mailto:${userData.emailAddress}`}
                >
                  {userData.emailAddress}
                </Link>
              </Tag>
              <Text mt="10px" fontSize={'md'}>
                (Pssst...that's your email ^)
              </Text>
            </Flex>
          </Flex>
        </>
      )}

      <Divider my="30px" />
    </>
  )
}
