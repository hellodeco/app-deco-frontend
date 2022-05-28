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
} from '@chakra-ui/react'
import Userfront from '@userfront/core'
import type { User } from "../types/types";

interface SetPasswordProps {
  userData: User
}

const PASSWORD_FIELD_ID = 'set-password-form-password'

export function SetPassword({ userData }: SetPasswordProps) {
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  console.log('helllo!!!!!!!!!!!1', userData)

  const handlePasswordChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setPassword(evt.target.value)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      // await Userfront.resetPassword({ password, uuid: 'abc', token: '123' })
      const res = await Userfront.signup({
        method: 'password',
        email: userData?.signupEmail,
        password,
      })
      console.log({ res })
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const buttonDisabled = password.length === 0 || isSubmitting

  return (
    <FormControl>
      <FormLabel htmlFor={PASSWORD_FIELD_ID}>Set Password</FormLabel>
      <Input
        id={PASSWORD_FIELD_ID} 
        onChange={handlePasswordChange}
        value={password}
        type='password'
      />
      <Button
        w='300px'
        my='20px'
        onClick={handleSubmit}
        disabled={buttonDisabled}
      >
         Set Password
      </Button>
    </FormControl>
  )
}
