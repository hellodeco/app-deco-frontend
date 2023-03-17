import { gql } from '@apollo/client'

export const SET_USERS_DECO_EMAIL = gql`
  mutation setDecoEmail($username: String) {
    setDecoEmail(username: $username) {
      success
      errorReason
    }
  }
`

export const CREATE_NEW_USER = gql`
  mutation createUserfrontAndDecoUser($email: String, $password: String) {
    createUserfrontAndDecoUser(email: $email, password: $password) {
      success
      errorMessage
    }
  }
`

export const SELECT_NOTION_DATABASE = gql`
  mutation selectNotionDatabase(
    $databaseId: String!
    $type: NotionDatabaseType!
  ) {
    selectNotionDatabase(databaseId: $databaseId, type: $type)
  }
`

export const CREATE_EMAIL_REPLY_PAGE = gql`
  mutation createEmailReplyPage($originalEmailUUID: String) {
    createEmailReplyPage(originalEmailUUID: $originalEmailUUID) {
      pageId
      notionEmailDatabaseId
      notionPageURL
    }
  }
`

export const SEND_EMAIL_REPLY = gql`
  mutation sendEmailReply($notionPageID: String, $originalEmailUUID: String) {
    sendEmailReply(
      notionPageID: $notionPageID
      originalEmailUUID: $originalEmailUUID
    ) {
      inboxPageURL
    }
  }
`
