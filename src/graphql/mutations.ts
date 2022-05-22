import { gql } from '@apollo/client';

export const UPDATE_USERS_DECO_EMAIL = gql`
   mutation updateDecoEmail($decoEmail: String) {
      updateDecoEmail(emailAddress: $decoEmail)
   }
`;

export const DROP_AND_MIGRATE_USERS_NOTION_DATABASE = gql`
   mutation dropAndMigrateUsersNotionDatabase {
      wipeNotionDatabase,
      deleteNotionTableProperties,
      formatNotionTable
   }
`;
