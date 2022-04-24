import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import type { User } from '../../types/types';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EMAIL_AVAILABILITY, GET_USER_META } from '../../graphql/queries';
import { UPDATE_USERS_DECO_EMAIL } from '../../graphql/mutations';

interface IProps {
   userData: User;
}

const AddNewEmailForm = () => {
   const [newDecoEmail, setNewDecoEmail] = useState('');
   const [emailValid, setEmailValid] = useState(false);
   const [emailAvailable, setEmailAvailable] = useState(true);
   const [showCreateButton, setShowCreateButton] = useState(false);
   // TODO add error handling for failed query or mutation
   const [showError, setShowError] = useState(false);

   const verifyEmail = (email: string) => {
      // TODO - update this regex to use the live domain @deco.so after we go live
      const emailRegex = /^\w+([\.-]?\w+)*@deco\.email$/;
      return emailRegex.test(email);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const decoEmail = e.target.value;
      setNewDecoEmail(decoEmail);
      setShowCreateButton(false);

      if (verifyEmail(decoEmail)) {
         setEmailValid(true);
      } else {
         setEmailValid(false);
      }
   };

   const { loading, error, data } = useQuery(GET_EMAIL_AVAILABILITY, {
      variables: { decoEmail: newDecoEmail },
   });

   const checkEmailAvailability = async () => {
      if (data?.emailAddressAvailable) {
         setEmailAvailable(true);
         setShowCreateButton(true);
      } else {
         setEmailAvailable(false);
         setShowCreateButton(false);
      }
   };

   const [handleUpdateEmail, updateEmailResult] = useMutation(UPDATE_USERS_DECO_EMAIL, {
      // Then re-run
      refetchQueries: [{ query: GET_USER_META }],
   });

   return (
      <>
         <Heading size='md' mt='20px'>
            Let's get your Deco email address set up
         </Heading>
         <>
            <FormControl mt='30px' isInvalid={!emailValid || !emailAvailable}>
               <FormLabel htmlFor='email'>
                  Enter an email address ending in "@deco.email". Once you choose, you can't change it, so choose
                  wisely!
               </FormLabel>
               <Input
                  w='450px'
                  size='lg'
                  id='email'
                  type='email'
                  value={newDecoEmail}
                  onChange={handleChange}
                  placeholder='name@deco.email'
               />
               {!emailValid && <FormErrorMessage>Email address is invalid</FormErrorMessage>}
               {!emailAvailable && <FormErrorMessage>Email address already taken</FormErrorMessage>}
            </FormControl>

            {showCreateButton ? (
               <>
                  <Tag mt='15px' width='-webkit-fit-content' size='lg' variant='solid' colorScheme='green'>
                     That email address is available!
                  </Tag>
                  <Button
                     w='300px'
                     my='20px'
                     onClick={() =>
                        handleUpdateEmail({
                           variables: { decoEmail: newDecoEmail },
                        })
                     }
                     disabled={!emailValid}>
                     Create Deco Email
                  </Button>
               </>
            ) : (
               <Button w='300px' my='20px' onClick={checkEmailAvailability} disabled={!emailValid}>
                  Check Availability
               </Button>
            )}
         </>
      </>
   );
};

export const ManageDecoEmail = (props: IProps) => {
   const { userData } = props;

   return (
      <>
         <Heading size='xl'>Your Deco Email Address</Heading>

         {!userData?.emailAddress ? (
            <AddNewEmailForm />
         ) : (
            <>
               <Heading size='md' mt='20px'>
                  Your Deco email address is:
               </Heading>

               <Tag mt='15px' width='-webkit-fit-content' size='lg' variant='solid' colorScheme='gray'>
                  {userData.emailAddress}
               </Tag>
            </>
         )}

         <Divider my='30px' />
      </>
   );
};
