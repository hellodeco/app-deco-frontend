import { Flex, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';

interface AppAccountProps {
   userData: User;
}

function AccountSettings({ userData }: AppAccountProps) {
   let navigate = useNavigate();

   return (
      <Flex flexDirection='column'>
         <Heading size='md'>Account Settings</Heading>
      </Flex>
   );
}

export default AccountSettings;
