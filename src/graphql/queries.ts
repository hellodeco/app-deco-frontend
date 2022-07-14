import { gql } from '@apollo/client'

export const GET_USER_META = gql`
  query currentUser {
    currentUser {
      fullName
      userfrontID
      emailAddress
      signupEmail
    }
  }
`

export const GET_EMAIL_AVAILABILITY = gql`
  query emailUsernameAvailable($username: String!) {
    emailUsernameAvailable(username: $username)
  }
`

export const GET_CURRENT_USER_NOTION_INTEGRATION = gql`
  query getCurrentUserNotionIntegration {
    getCurrentUserNotionIntegration {
      userfrontUserId
      tokenType
      workspaceId
      workspaceName
      workspaceIcon
      botId
      userId
      userFullName
      avatarUrl
      type
      email
    }
  }
`

export const GET_CURRENT_USER_NOTION_DATABASE_INFO = gql`
  query getCurrentUserNotionDatabaseInfo {
    getCurrentUserNotionDatabaseInfo {
      title
      url
      icon
      needsFormatting
      needsManualFormatting
    }
  }
`

export const EMAIL_DOMAIN = gql`
  query emailDomain {
    emailDomain
  }
`

export const CONNECTED_NOTION_PAGES = gql`
  query connectedNotionPages {
    connectedNotionPages {
      id
      url
      title
      icon {
			  type
        emoji
        url
      }
    }
  }
`
