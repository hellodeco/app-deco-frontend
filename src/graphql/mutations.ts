import { gql } from '@apollo/client';

export const SET_USERS_DECO_EMAIL = gql`
   mutation setDecoEmail($username: String) {
      setDecoEmail(username: $username) {
         success
         errorReason
      }
   }
`;

export const DROP_AND_MIGRATE_USERS_NOTION_DATABASE = gql`
   mutation dropAndMigrateUsersNotionDatabase {
      wipeNotionDatabase,
      deleteNotionTableProperties,
      formatNotionTable
   }
`;
