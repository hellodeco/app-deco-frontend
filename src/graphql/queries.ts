import { gql } from '@apollo/client';

export const GET_USER_META = gql`
   query currentUser {
      currentUser {
         fullName
         userfrontID
         emailAddress
         signupEmail
      }
   }
`;

export const GET_EMAIL_AVAILABILITY = gql`
   query emailUsernameAvailable($username: String!) {
      emailUsernameAvailable(username: $username)
   }
`;

export const GET_NOTION_AUTH = gql`
   query getCurrentUserNotionIntegration {
      getCurrentUserNotionIntegration {
         userfrontUserId
         tokenType
         workspaceId
         workspaceName
         workspaceIcon
         botID
         userID
         userFullName
         avatarURL
         type
         email
      }
   }
`;
