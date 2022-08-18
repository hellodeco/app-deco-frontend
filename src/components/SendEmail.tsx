import React, { useState } from 'react'
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  FormHelperText,
  Button,
} from '@chakra-ui/react'
import { isNumber } from 'lodash'
import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { Helmet } from 'react-helmet'
import { useQuery as useQueryParams } from '../hooks/useQuery'

const SEND_EMAIL = gql`
  mutation sendMailBeta($email: SendMailBetaEmail!, $args: SendMailBetaArgs) {
    sendMailBeta(email: $email, args: $args) {
      success
      message
    }
  }
`

function FullScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      width="100vw"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      flexDir="column"
    >
      {children}
    </Flex>
  )
}

interface EmailEditorProps {

}

//subject: String
//to: [SendMailBetaRecipientInput!]!
//cc: [SendMailBetaRecipientInput]
//bcc: [SendMailBetaRecipientInput]
//plainTextContent: String
//attachments: [SendMailBetaAttachmentInput]

function EmailEditor({}: EmailEditorProps) {
  const params = useQueryParams()

  const [subject, setSubject] = useState('')
  const [to, setTo] = useState('')
  const [emailContent, setEmailContent] = useState('')
  
  const [sendEmail, { data, loading, error }] = useMutation(SEND_EMAIL, {

  })

  console.log({ data, loading, error })

  return (
    <FormControl>

      <FormLabel>To</FormLabel>
      <Input type="email" onChange={(e) => setTo(e.target.value)} value={to} />

      <FormLabel>Subject</FormLabel>
      <Input type="text" onChange={(e) => setSubject(e.target.value)} value={subject} />

      <FormLabel>Email</FormLabel>
      <Textarea onChange={(e) => setEmailContent(e.target.value)} value={emailContent} />

      <Button
        onClick={() => {
          const args: { inReplyToEmailId?: number } = {}

          const inReplyToEmailId = Number(params.get('inReplyToEmailId'))

          if  (isNumber(inReplyToEmailId)) {
            args.inReplyToEmailId = inReplyToEmailId
          }

          sendEmail({
            variables: {
              email: {
                subject,
                plainTextContent: emailContent,
                to: [
                  { email: to }
                ],
                cc: [],
                bcc: [],
                attachments: [],
              },
              args,
            }
          })
        }} 
      >
        Send
      </Button>

    </FormControl>

  )
}

interface SendEmailProps {

}

function SendEmail({}: SendEmailProps) {

  return (
    <FullScreenContainer>
      <Flex width="900px">
      <Helmet>
        <meta property="og:url" content="https://vsp.ngrok.io/send-email?inReplyToEmailId=120" />
        <meta property="og:title" content="Email for your Notion workspace" />
      </Helmet>
      <EmailEditor />
      </Flex>
    </FullScreenContainer>

  )

}

export default SendEmail
