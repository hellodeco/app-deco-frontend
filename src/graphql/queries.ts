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
   query isEmailAvailable($decoEmail: String) {
      emailAddressAvailable(email: $decoEmail)
   }
`;
