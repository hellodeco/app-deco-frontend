import { gql } from '@apollo/client';

export const UPDATE_USERS_DECO_EMAIL = gql`
   mutation updateDecoEmail($decoEmail: String) {
      updateDecoEmail(emailAddress: $decoEmail)
   }
`;
