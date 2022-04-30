import React from 'react';
import { Flex } from '@chakra-ui/react';
import type { User } from '../types/types';
import { ManageDecoEmail } from './deco-email/ManageDecoEmail';
import { NotionAuth } from './deco-email/NotionAuth';
import { FormatNotionPage } from './deco-email/FormatNotionPage';
interface DecoEmailProps {
   userData: User;
}

function DecoEmail({ userData }: DecoEmailProps) {
   return (
      <Flex flexDirection='column' w='100%'>
         <ManageDecoEmail userData={userData} />
         <NotionAuth />
         <FormatNotionPage />
      </Flex>
   );
}

export default DecoEmail;
