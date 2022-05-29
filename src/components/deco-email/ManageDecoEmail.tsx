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
   Tag,
   Text,
} from '@chakra-ui/react';
import type { User } from '../../types/types';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EMAIL_AVAILABILITY, GET_USER_META } from '../../graphql/queries';
import { SET_USERS_DECO_EMAIL } from '../../graphql/mutations';

interface IProps {
   userData: User;
}

function AddNewEmailForm() {
   const [newDecoEmailUsername, setNewDecoEmail] = useState('');
   const [emailValid, setEmailValid] = useState(true);
   const [emailAvailable, setEmailAvailable] = useState(true);
   const [showCreateButton, setShowCreateButton] = useState(false);
   // TODO add error handling for failed query or mutation
   const [showError, setShowError] = useState(false);

   const isValidEmailUsername = (email: string) => {
      const emailRegex = /^\w+([\.-]?\w+)*$/;
      return emailRegex.test(email);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const decoEmailUsername = e.target.value
      setNewDecoEmail(decoEmailUsername);
      setShowCreateButton(false);

      setEmailValid(
         isValidEmailUsername(decoEmailUsername)
      )
   };

   const { data } = useQuery(GET_EMAIL_AVAILABILITY, {
      variables: { username: newDecoEmailUsername },
   });

   const checkEmailAvailability = async () => {
      if (data?.emailUsernameAvailable) {
         setEmailAvailable(true);
         setShowCreateButton(true);
      } else {
         setEmailAvailable(false);
         setShowCreateButton(false);
      }
   };

   const [
      handleSetEmail,
      { data: setEmailData },
   ] = useMutation(SET_USERS_DECO_EMAIL, {
      refetchQueries: [{ query: GET_USER_META }],
   });

   const showValidationError =
      !emailValid ||
      !emailAvailable ||
      setEmailData?.__typename === 'UpdateDecoEmailFail'

   return (
      <>
         <Heading size='md' mt='20px'>
            Let's get your Deco email address set up
         </Heading>
         <>
            <FormControl mt='30px' isInvalid={showValidationError}>
               <FormLabel htmlFor='email'>
                  Enter an email address ending in "@deco.email". Once you choose, you can't change it, so choose
                  wisely!
               </FormLabel>
               <Flex flexDir="row" alignItems="center">
                 <Input
                    w='450px'
                    size='lg'
                    id='email'
                    type='email'
                    value={newDecoEmailUsername}
                    onChange={handleChange}
                    placeholder='name'
                 />
                 <Text color="gray.dark" pl="13px">@deco.email</Text>
               </Flex>
               {!emailValid && <FormErrorMessage>Email address is invalid</FormErrorMessage>}
               {!emailAvailable && <FormErrorMessage>Email address already taken</FormErrorMessage>}
               {setEmailData?.__typename === 'UpdateDecoEmailFail' && (
                  <FormErrorMessage>{setEmailData?.message}</FormErrorMessage>
               )}
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
                        handleSetEmail({
                           variables: { username: newDecoEmailUsername },
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

export function ManageDecoEmail(props: IProps) {
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
