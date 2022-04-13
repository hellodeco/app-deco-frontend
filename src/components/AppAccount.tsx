import React, { useEffect, useState } from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';
import Userfront from '@userfront/core';

interface AppAccountProps {
   userData: User;
}

function AppAccount({ userData }: AppAccountProps) {
   let navigate = useNavigate();

   // useEffect(() => {
   //    const backendResponse = async () => {
   //       const res: any = await fetch('http://localhost:4000/healthz');

   //       const message = await res.json();
   //    };
   //    backendResponse();
   // }, []);

   return (
      <Flex flexDirection='column' alignContent='center' justifyContent='center'>
         <Flex direction='column' alignItems={'flex-start'}>
            <Heading px='13px' py='5px' size='sm'>
               {Userfront.user.email}
            </Heading>
         </Flex>
      </Flex>
   );
}

export default AppAccount;
