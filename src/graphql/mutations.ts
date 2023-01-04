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

export const DROP_AND_MIGRATE_USERS_NOTION_DATABASE = gql`
  mutation dropAndMigrateUsersNotionDatabase {
    wipeNotionDatabase
    deleteNotionTableProperties
    formatNotionTable
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
