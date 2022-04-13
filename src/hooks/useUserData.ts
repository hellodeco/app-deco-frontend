import { useState, useEffect } from 'react';
import type { User, UserMetaData } from '../types/types';
import Userfront from '@userfront/core';

export function useUserData() {
   const [userData, setUserData] = useState<User>();

   useEffect(() => {
      const fetchInitialUserData = async () => {
         if (!Userfront.accessToken()) {
            return;
         }

         // we will need to set up Apollo to query user data from Graphql Server here

         setUserData({ email: 'george@deco.so' });
      };
      fetchInitialUserData();
      /**
       * We need to pass an empty array here to ensure that this code gets called exactly one time
       */
   }, []);

   return {
      userData,
      setUserData,
   };
}
